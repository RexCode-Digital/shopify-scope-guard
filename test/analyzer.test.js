import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { audit } from '../src/analyzer/index.js';
import { toJson, toSarif } from '../src/output/index.js';

const fixture = name => path.join(process.cwd(), 'examples', name);
test('pass fixture has no findings', () => assert.equal(audit({ root: fixture('01-minimal-pass') }).findings.length, 0));
test('missing scope is high', () => { const r = audit({ root: fixture('02-missing-scope') }); assert.equal(r.findings[0].ruleId, 'SG-SCOPE-001'); assert.equal(r.findings[0].severity, 'high'); });
test('redundant read is medium', () => assert.ok(audit({ root: fixture('03-redundant-read') }).findings.some(f => f.ruleId === 'SG-SCOPE-003')));
test('optional required mismatch is high', () => assert.ok(audit({ root: fixture('04-optional-scope') }).findings.some(f => f.ruleId === 'SG-SCOPE-002')));
test('write implies read', () => assert.equal(audit({ root: fixture('05-write-implies-read') }).findings.length, 0));
test('orders use read_orders', () => assert.equal(audit({ root: fixture('06-orders') }).findings.length, 0));
test('customers use read_customers', () => assert.equal(audit({ root: fixture('07-customers') }).findings.length, 0));
test('product mutation uses write_products', () => assert.equal(audit({ root: fixture('08-products') }).findings.length, 0));
test('inventory uses read_inventory', () => assert.equal(audit({ root: fixture('09-inventory') }).findings.length, 0));
test('metaobjects use documented scope', () => assert.equal(audit({ root: fixture('10-metaobjects') }).findings.length, 0));
test('cart transforms use write_cart_transforms', () => assert.equal(audit({ root: fixture('11-cart-transform') }).findings.length, 0));
test('multiple documents are analyzed', () => { const r = audit({ root: fixture('12-multiple-graphql-documents') }); assert.equal(r.observations.length, 2); assert.ok(r.findings.some(f => f.ruleId === 'SG-SCOPE-003')); });
test('runtime query becomes unknown', () => assert.ok(audit({ root: fixture('13-unknown-runtime-pattern') }).findings.some(f => f.ruleId === 'SG-SCOPE-006')));
test('storefront is not compared with admin rules', () => assert.equal(audit({ root: fixture('14-storefront-not-admin') }).findings.length, 0));
test('visible admin endpoint is detected', () => assert.equal(audit({ root: fixture('15-version-specific-behaviour') }).findings.length, 0));
test('2026-10 evidence maps analytics, reports, and rollouts', () => {
  const r = audit({ root: fixture('16-2026-10-evidence') });
  assert.equal(r.findings.length, 0);
  assert.ok(r.observations.some(item => item.operation === 'shop.analyticsAnnotations'));
  assert.ok(r.observations.some(item => item.operation === 'analyticsTargets'));
  assert.ok(r.observations.some(item => item.operation === 'rollouts'));
});
test('discount rollouts nested under discountNode require read_rollouts', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'scope-discount-rollouts-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.writeFileSync(path.join(root, 'shopify.app.toml'), '[access_scopes]\nscopes="read_discounts"');
  fs.writeFileSync(path.join(root, 'discount.graphql'), `query DiscountRollouts {
    discountNode(id: "gid://shopify/DiscountNode/1") {
      discount { ...RolloutFields }
    }
  }
  fragment RolloutFields on DiscountCodeBasic {
    rolloutInfo: rollouts(first: 1) { nodes { id } }
  }`);
  const report = audit({ root });
  assert.ok(report.observations.some(item => item.operation === 'discountNode.discount.rollouts' && item.scope.includes('read_rollouts')));
  assert.ok(report.findings.some(item => item.ruleId === 'SG-SCOPE-001' && item.scope === 'read_rollouts'));
  assert.equal(report.unknown.length, 0);
  fs.writeFileSync(path.join(root, 'shopify.app.toml'), '[access_scopes]\nscopes="read_discounts,read_rollouts"');
  assert.equal(audit({ root }).findings.some(item => item.ruleId === 'SG-SCOPE-001'), false);
});
test('json output is stable and parseable', () => { const json = toJson(audit({ root: fixture('02-missing-scope') })); assert.equal(JSON.parse(json).tool.name, 'shopify-scope-guard'); });
test('sarif output is 2.1.0', () => assert.equal(JSON.parse(toSarif(audit({ root: fixture('02-missing-scope') }))).version, '2.1.0'));
import fs from 'node:fs';
import os from 'node:os';
import { EVIDENCE_REGISTRY } from '../src/evidence/registry.js';
for (const rule of EVIDENCE_REGISTRY) {
  test(`registry mapping: ${rule.operation}`, t => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'scope-registry-'));
    t.after(() => fs.rmSync(root, {recursive:true,force:true}));
    fs.writeFileSync(path.join(root, 'shopify.app.toml'), '[access_scopes]\nscopes=""');
    const parts=rule.operation.split('.');
    let selection = parts.pop() + '{ id }';
    for(const part of parts.reverse()) selection = `${part} { ${selection} }`;
    fs.writeFileSync(path.join(root,'operation.graphql'),`${rule.operationType} { ${selection} }`);
    const report=audit({root});
    assert.ok(report.observations.some(o=>o.operation===rule.operation));
    assert.ok(report.findings.some(f=>f.scope===rule.requires.anyOf[0]&&f.ruleId==='SG-SCOPE-001'));
    const requiredScopes = new Set();
    let prefix = '';
    for (const part of rule.operation.split('.')) {
      prefix = prefix ? `${prefix}.${part}` : part;
      for (const ancestor of EVIDENCE_REGISTRY.filter(item => item.operation === prefix && item.operationType === rule.operationType)) requiredScopes.add(ancestor.requires.anyOf[0]);
    }
    fs.writeFileSync(path.join(root,'shopify.app.toml'),`[access_scopes]\nscopes="${[...requiredScopes].join(',')}"`);
    assert.ok(!audit({root}).findings.some(f=>f.ruleId==='SG-SCOPE-001'));
  });
}
