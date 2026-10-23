import test from 'node:test';
import assert from 'node:assert/strict';
import fc from 'fast-check';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parseConfig } from '../src/config/index.js';
import { parseGraphQL } from '../src/graphql/index.js';

const characters = [...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_'];
const atom = fc.array(fc.constantFrom(...characters), { minLength: 1, maxLength: 16 })
  .map((value) => value.join(''));
const options = { seed: 20261025, numRuns: 100, endOnFailure: true };

test('bounded fragment chains produce stable field paths without false positives', () => {
  fc.assert(fc.property(
    fc.integer({ min: 1, max: 12 }),
    fc.array(atom.map((value) => `field_${value}`), { minLength: 1, maxLength: 10 }),
    (depth, fields) => {
      const fragments = Array.from({ length: depth }, (_, index) => {
        const body = index + 1 < depth ? `...${'Fragment' + (index + 1)}` : fields.join(' ');
        return `fragment Fragment${index} on Shop { ${body} }`;
      });
      const source = `query Generated { shop { ...Fragment0 } }\n${fragments.join('\n')}`;
      const first = parseGraphQL(source, 'generated.graphql', 4);
      const second = parseGraphQL(source, 'generated.graphql', 4);
      assert.deepEqual(first, second);
      assert.deepEqual(first[0].fields.map((field) => field.path), [
        'shop',
        ...fields.map((field) => `shop.${field}`),
      ]);
      assert.ok(first[0].fields.every((field) => field.line >= 5));
    },
  ), options);
});

test('generated unresolved and cyclic fragments fail closed', () => {
  fc.assert(fc.property(atom, (name) => {
    const unresolved = `query Generated { shop { ...Missing_${name} } }`;
    const cyclic = `query Generated { shop { ...Fragment_${name} } } fragment Fragment_${name} on Shop { ...Fragment_${name} }`;
    assert.throws(() => parseGraphQL(unresolved, 'generated.graphql'), /Unresolved or cyclic GraphQL fragment/);
    assert.throws(() => parseGraphQL(cyclic, 'generated.graphql'), /Unresolved or cyclic GraphQL fragment/);
  }), options);
});

test('malformed Shopify TOML errors remain bounded and do not echo generated values', (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'scope-toml-property-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const file = path.join(root, 'shopify.app.toml');
  fc.assert(fc.property(atom, (value) => {
    const sentinel = `SYNTHETIC_SECRET_${value}`;
    fs.writeFileSync(file, `[access_scopes\nscopes = "read_${value}"\n# ${sentinel}\n`);
    assert.throws(() => parseConfig(file), (error) => {
      assert.equal(error.message, 'Invalid Shopify app TOML; contents were not printed');
      assert.equal(error.message.includes(sentinel), false);
      return true;
    });
  }), options);
});
