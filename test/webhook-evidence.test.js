import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { audit } from '../src/analyzer/index.js';
import { CLASSIC_WEBHOOK_TOPIC_EVIDENCE } from '../src/evidence/registry.js';
import { toHuman, toJson, toSarif } from '../src/output/index.js';

const action = path.resolve('dist/index.cjs');

function fixture(t, scopes = '', extra = '') {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'scope-webhook-evidence-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.writeFileSync(path.join(root, 'shopify.app.toml'), `[access_scopes]\nscopes="${scopes}"\n${extra}`);
  return root;
}

function topicObservation(report, topic) {
  return report.observations.find(item => item.operation === `webhooks.subscriptions.${topic}`);
}

test('classic products/update evidence is distinct, versioned and privacy-safe', t => {
  const root = fixture(t, 'read_products', `[webhooks]\napi_version="2026-10"\n\n[[webhooks.subscriptions]]\ntopics=["products/update"]\nuri="PRIVATE_WEBHOOK_DESTINATION"\nfilter="PRIVATE_WEBHOOK_FILTER"\n`);
  const report = audit({ root });
  const observation = topicObservation(report, 'products/update');
  assert.equal(observation.apiSurface, 'classic-webhook');
  assert.equal(observation.evidenceStatus, 'EVIDENCED');
  assert.equal(observation.confidence, 'high');
  assert.equal(observation.evidenceVersion, '2026-10');
  assert.deepEqual(observation.scope, ['read_products']);
  assert.equal(observation.file, 'shopify.app.toml');
  assert.equal(report.summary.classicWebhooks.evidenced, 1);
  assert.equal(report.summary.classicWebhooks.notEvidenced, 0);
  assert.equal(report.findings.some(item => item.ruleId === 'SG-SCOPE-001'), false);
  assert.ok(CLASSIC_WEBHOOK_TOPIC_EVIDENCE['products/update'].source.includes('WebhookSubscriptionTopic'));
  for (const rendered of [toJson(report), toHuman(report), toSarif(report)]) {
    assert.doesNotMatch(rendered, /PRIVATE_WEBHOOK_(?:DESTINATION|FILTER)/);
  }
  const sarif = JSON.parse(toSarif(report));
  assert.deepEqual(sarif.runs[0].properties.classicWebhooks, { evidenced: 1, notEvidenced: 0, unknown: 0 });
  assert.equal(sarif.runs[0].properties.classicWebhookObservations[0].evidenceStatus, 'EVIDENCED');
  assert.match(toHuman(report), /EVIDENCED webhooks\.subscriptions\.products\/update/);
});

test('mapped topics with missing scopes are NOT EVIDENCED and produce high-confidence findings', t => {
  const root = fixture(t, '', `[webhooks]\napi_version="2026-10"\n\n[[webhooks.subscriptions]]\ntopics=["products/update"]\nuri="/webhooks/products"\n`);
  const report = audit({ root });
  const observation = topicObservation(report, 'products/update');
  assert.equal(observation.evidenceStatus, 'NOT EVIDENCED');
  assert.equal(report.summary.classicWebhooks.notEvidenced, 1);
  const finding = report.findings.find(item => item.ruleId === 'SG-SCOPE-001');
  assert.equal(finding.severity, 'high');
  assert.equal(finding.confidence, 'high');
  assert.equal(finding.file, 'shopify.app.toml');
  assert.match(finding.explanation, /products\/update/);
  assert.match(finding.remediation, /read_products/);
});

test('orders/create accepts documented alternatives and does not treat optional scopes as granted', t => {
  const required = fixture(t, 'read_marketplace_orders', `[webhooks]\napi_version="2026-10"\n\n[[webhooks.subscriptions]]\ntopics=["orders/create"]\nuri="/orders"\n`);
  const requiredReport = audit({ root: required });
  assert.equal(topicObservation(requiredReport, 'orders/create').evidenceStatus, 'EVIDENCED');
  assert.equal(requiredReport.findings.some(item => ['SG-SCOPE-001', 'SG-SCOPE-002'].includes(item.ruleId)), false);
  assert.deepEqual(CLASSIC_WEBHOOK_TOPIC_EVIDENCE['orders/create'].scopes, ['read_orders', 'read_marketplace_orders']);

  const implied = fixture(t, 'write_orders', `[webhooks]\napi_version="2026-10"\n\n[[webhooks.subscriptions]]\ntopics=["orders/create"]\nuri="/orders"\n`);
  assert.equal(topicObservation(audit({ root: implied }), 'orders/create').evidenceStatus, 'EVIDENCED');

  const optional = fixture(t, '', `optional_scopes=["read_marketplace_orders"]\n[webhooks]\napi_version="2026-10"\n\n[[webhooks.subscriptions]]\ntopics=["orders/create"]\nuri="/orders"\n`);
  const optionalReport = audit({ root: optional });
  assert.equal(topicObservation(optionalReport, 'orders/create').evidenceStatus, 'NOT EVIDENCED');
  const optionalFinding = optionalReport.findings.find(item => item.ruleId === 'SG-SCOPE-002' && item.scope === 'read_marketplace_orders');
  assert.ok(optionalFinding);
  assert.match(optionalFinding.remediation, /optional scopes are not treated as granted/i);
  assert.doesNotMatch(optionalFinding.remediation, /conditional on an optional-scope request/i);
});

test('write_marketplace_orders grants evidence only when declared as required', t => {
  const required = fixture(t, 'write_marketplace_orders', `[webhooks]\napi_version="2026-10"\n\n[[webhooks.subscriptions]]\ntopics=["orders/create"]\nuri="/orders"\n`);
  const requiredReport = audit({ root: required });
  assert.equal(topicObservation(requiredReport, 'orders/create').evidenceStatus, 'EVIDENCED');
  assert.equal(requiredReport.findings.some(item => item.ruleId === 'SG-SCOPE-001'), false);

  const optional = fixture(t, '', `optional_scopes=["write_marketplace_orders"]\n[webhooks]\napi_version="2026-10"\n\n[[webhooks.subscriptions]]\ntopics=["orders/create"]\nuri="/orders"\n`);
  const optionalReport = audit({ root: optional });
  assert.equal(topicObservation(optionalReport, 'orders/create').evidenceStatus, 'NOT EVIDENCED');
  assert.ok(optionalReport.findings.some(item => item.ruleId === 'SG-SCOPE-002'));
});

test('multiple subscriptions deduplicate topic requirements without exposing destinations', t => {
  const root = fixture(t, 'read_products', `[webhooks]\napi_version="2026-10"\n\n[[webhooks.subscriptions]]\ntopics=["products/update", "orders/create"]\nuri="PRIVATE_DESTINATION_ONE"\n\n[[webhooks.subscriptions]]\ntopics=["products/update"]\nuri="PRIVATE_DESTINATION_TWO"\n`);
  const report = audit({ root });
  assert.equal(report.observations.filter(item => item.apiSurface === 'classic-webhook').length, 2);
  assert.equal(report.summary.classicWebhooks.evidenced, 1);
  assert.equal(report.summary.classicWebhooks.notEvidenced, 1);
  assert.equal(report.findings.filter(item => item.ruleId === 'SG-SCOPE-001').length, 1);
  assert.doesNotMatch(JSON.stringify(report), /PRIVATE_DESTINATION/);
});

test('unsupported topics and API versions remain UNKNOWN rather than scope failures', t => {
  for (const [version, topic] of [['2026-10', 'synthetic/unknown'], ['2026-10', 'constructor'], ['2026-10', '__proto__'], ['2027-01', 'products/update'], ['', 'orders/create']]) {
    const versionLine = version ? `api_version="${version}"` : '';
    const root = fixture(t, '', `[webhooks]\n${versionLine}\n\n[[webhooks.subscriptions]]\ntopics=["${topic}"]\nuri="PRIVATE_DESTINATION"\n`);
    const report = audit({ root });
    assert.equal(report.summary.classicWebhooks.unknown, 1);
    assert.equal(report.observations.filter(item => item.apiSurface === 'classic-webhook').length, 0);
    assert.equal(report.findings.some(item => item.ruleId === 'SG-SCOPE-001'), false);
    assert.ok(report.findings.some(item => item.ruleId === 'SG-SCOPE-006'));
    assert.doesNotMatch(JSON.stringify(report), /PRIVATE_DESTINATION|synthetic\/unknown/);
  }
});

test('classic webhooks and Shopify Events keep separate evidence surfaces', t => {
  const root = fixture(t, 'read_products', `[webhooks]\napi_version="2026-10"\n\n[[webhooks.subscriptions]]\ntopics=["products/update"]\nuri="/webhooks/products"\n\n[events]\napi_version="2026-10"\n\n[[events.subscription]]\ntopic="Product"\nactions=["update"]\ntriggers=["product.title"]\nuri="/events/products"\n`);
  const report = audit({ root });
  assert.ok(report.observations.some(item => item.apiSurface === 'classic-webhook' && item.operation === 'webhooks.subscriptions.products/update'));
  assert.ok(report.observations.some(item => item.apiSurface === 'events' && item.operation === 'events.subscription.Product'));
  assert.equal(report.summary.classicWebhooks.evidenced, 1);
  assert.equal(report.unknown.length, 0);
});

test('repositories without classic subscriptions remain unchanged and reports are deterministic', t => {
  const root = fixture(t, 'read_products');
  const first = audit({ root }), second = audit({ root });
  assert.deepEqual(first.summary.classicWebhooks, { evidenced: 0, notEvidenced: 0, unknown: 0 });
  assert.equal(first.observations.length, 0);
  assert.equal(toJson(first), toJson(second));
  assert.match(toHuman(first), /Classic webhooks: EVIDENCED 0, NOT EVIDENCED 0, UNKNOWN 0/);
});

test('malformed and compliance-only classic subscriptions stay UNKNOWN', t => {
  for (const subscriptions of [
    `[[webhooks.subscriptions]]\ntopics="products/update"\nuri="/webhooks"`,
    `[[webhooks.subscriptions]]\ncompliance_topics=["customers/redact"]\nuri="/webhooks/redact"`,
  ]) {
    const root = fixture(t, '', `[webhooks]\napi_version="2026-10"\n\n${subscriptions}\n`);
    const report = audit({ root });
    assert.equal(report.summary.classicWebhooks.unknown, 1);
    assert.equal(report.observations.filter(item => item.apiSurface === 'classic-webhook').length, 0);
    assert.ok(report.findings.some(item => item.ruleId === 'SG-SCOPE-006'));
  }
});

test('app selection keeps classic webhook scope evidence inside the chosen app root', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'scope-webhook-monorepo-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const [app, scope] of [['a', 'read_products'], ['b', '']]) {
    const dir = path.join(root, 'apps', app);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'shopify.app.toml'), `[access_scopes]\nscopes="${scope}"\n[webhooks]\napi_version="2026-10"\n[[webhooks.subscriptions]]\ntopics=["products/update"]\nuri="/webhooks/${app}"\n`);
  }
  const report = audit({ root, configPath: 'apps/a/shopify.app.toml' });
  assert.equal(report.summary.classicWebhooks.evidenced, 1);
  assert.equal(report.summary.classicWebhooks.notEvidenced, 0);
  assert.equal(report.observations[0].file, 'shopify.app.toml');
});

test('Action exposes classic webhook evidence counts and SARIF retains the summary', t => {
  const root = fixture(t, '', `[webhooks]\napi_version="2026-10"\n\n[[webhooks.subscriptions]]\ntopics=["products/update"]\nuri="PRIVATE_ACTION_DESTINATION"\n`);
  const outputFile = path.join(root, 'outputs.txt');
  fs.writeFileSync(outputFile, '');
  const result = spawnSync(process.execPath, [action], {
    encoding: 'utf8',
    env: { ...process.env, INPUT_PATH: root, INPUT_FORMAT: 'sarif', INPUT_FAIL_ON: 'none', GITHUB_OUTPUT: outputFile, RUNNER_TEMP: root },
  });
  assert.equal(result.status, 0, result.stderr);
  const output = fs.readFileSync(outputFile, 'utf8');
  assert.match(output, /webhook-not-evidenced-count<<[^\n]+\n1\n/);
  assert.match(output, /webhook-evidenced-count<<[^\n]+\n0\n/);
  assert.match(output, /webhook-unknown-count<<[^\n]+\n0\n/);
  assert.doesNotMatch(result.stdout, /PRIVATE_ACTION_DESTINATION/);
  const sarif = JSON.parse(fs.readFileSync(path.join(root, 'scope-guard.sarif'), 'utf8'));
  assert.deepEqual(sarif.runs[0].properties.classicWebhooks, { evidenced: 0, notEvidenced: 1, unknown: 0 });
  assert.equal(sarif.runs[0].properties.classicWebhookObservations[0].evidenceStatus, 'NOT EVIDENCED');
});
