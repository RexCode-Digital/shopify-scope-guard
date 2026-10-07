import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { audit } from '../src/analyzer/index.js';
import { EVIDENCE_REGISTRY, EVENTS_TOPIC_EVIDENCE } from '../src/evidence/registry.js';

function root(t, app, files = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'scope-current-evidence-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.writeFileSync(path.join(dir, 'shopify.app.toml'), app);
  for (const [name, value] of Object.entries(files)) {
    const file = path.join(dir, name); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, value);
  }
  return dir;
}

test('2026-10 payment, billing, and market hierarchy evidence is mapped to official scopes', t => {
  const dir = root(t, '[access_scopes]\nscopes=""', {
    'api.graphql': `mutation AddPayment { paymentInstrumentSendAddEmail(mandate: { resourceType: ORDERS, resourceId: "1" }) { customer { id } } }\nquery BillingAndMarkets { feeDetails { id } marketRelationshipsStatus { version } marketRelationships(first: 1) { nodes { parentMarket { id } childMarket { id } } } market(id: "gid://shopify/Market/1") { parentMarkets(first: 1) { nodes { id } } childMarketsCount } }`
  });
  const report = audit({ root: dir });
  for (const [operation, scope] of [['paymentInstrumentSendAddEmail', 'write_customers'], ['feeDetails', 'read_billing'], ['marketRelationships', 'read_markets'], ['marketRelationshipsStatus', 'read_markets'], ['marketRelationships.nodes.parentMarket', 'read_markets'], ['marketRelationships.nodes.childMarket', 'read_markets'], ['market.parentMarkets', 'read_markets'], ['market.childMarketsCount', 'read_markets']]) {
    assert.ok(report.observations.some(item => item.operation === operation && item.scope.includes(scope)), operation);
    assert.ok(report.findings.some(item => item.scope === scope && item.evidence.includes(operation)), operation);
  }
  assert.ok(EVIDENCE_REGISTRY.filter(item => ['paymentInstrumentSendAddEmail', 'feeDetails', 'marketRelationships', 'marketRelationshipsStatus'].includes(item.operation)).every(item => item.introduced === '2026-10' && item.source.startsWith('https://shopify.dev/')));
});

test('Events topic scope mapping uses 2026-10 topic evidence and never emits query/filter contents', t => {
  const dir = root(t, `[access_scopes]\nscopes="read_orders"\n[events]\napi_version="2026-10"\n[[events.subscription]]\nhandle="private-fixture"\ntopic="Product"\nactions=["update"]\ntriggers=["product.title"]\nuri="/events"\nquery="PRIVATE_QUERY_SENTINEL"\nquery_filter="PRIVATE_FILTER_SENTINEL"`);
  const report = audit({ root: dir });
  assert.ok(report.observations.some(item => item.operation === 'events.subscription.Product' && item.scope.includes('read_products')));
  assert.ok(report.findings.some(item => item.scope === 'read_products' && item.evidence.includes('events.subscription.Product')));
  assert.equal(Object.keys(EVENTS_TOPIC_EVIDENCE).length, 18);
  assert.ok(!JSON.stringify(report).includes('PRIVATE_QUERY_SENTINEL'));
  assert.ok(!JSON.stringify(report).includes('PRIVATE_FILTER_SENTINEL'));
});

test('unknown Events topics and non-2026-10 API versions remain unknown', t => {
  for (const [version, topic] of [['2026-10', 'SyntheticUnknownTopic'], ['unstable', 'Product']]) {
    const dir = root(t, `[access_scopes]\nscopes=""\n[events]\napi_version="${version}"\n[[events.subscription]]\nhandle="fixture"\ntopic="${topic}"\nactions=["create"]\nuri="/events"`);
    const report = audit({ root: dir });
    assert.ok(report.unknown.some(item => item.reason.includes('Events topic or API version')));
    assert.ok(!report.observations.some(item => item.operation.startsWith('events.subscription.')));
  }
});
