export const EVIDENCE_VERSION = '2026-07';
export const EVIDENCE_SOURCES = {
  scopes: 'https://shopify.dev/docs/apps/build/authentication-authorization/manage-access-scopes',
  accessScopes: 'https://shopify.dev/docs/api/usage/access-scopes',
  versioning: 'https://shopify.dev/docs/api/usage/versioning'
};

const rule = (ruleId, operation, anyOf, source, notes = '') => ({
  ruleId, api: 'admin-graphql', operation, requires: { anyOf }, introduced: '2023-01',
  lastVerified: EVIDENCE_VERSION, source, evidenceType: 'official-api-reference', confidence: 'high', notes
});

export const EVIDENCE_REGISTRY = [
  rule('SG-SCOPE-001', 'productCreate', ['write_products'], 'https://shopify.dev/docs/api/admin-graphql/latest/mutations/productcreate'),
  rule('SG-SCOPE-001', 'productUpdate', ['write_products'], 'https://shopify.dev/docs/api/admin-graphql/latest/mutations/productupdate'),
  rule('SG-SCOPE-001', 'productSet', ['write_products'], 'https://shopify.dev/docs/api/admin-graphql/latest/mutations/productset'),
  rule('SG-SCOPE-001', 'productOptionsCreate', ['write_products'], 'https://shopify.dev/docs/api/admin-graphql/latest/mutations/productoptionscreate'),
  rule('SG-SCOPE-001', 'collectionCreate', ['write_products'], 'https://shopify.dev/docs/api/admin-graphql/latest/mutations/collectioncreate'),
  rule('SG-SCOPE-001', 'products', ['read_products'], 'https://shopify.dev/docs/api/admin-graphql/latest/queries/products'),
  rule('SG-SCOPE-001', 'product', ['read_products'], 'https://shopify.dev/docs/api/admin-graphql/latest/queries/product'),
  rule('SG-SCOPE-001', 'productVariants', ['read_products'], 'https://shopify.dev/docs/api/admin-graphql/latest/queries/productvariants'),
  rule('SG-SCOPE-001', 'orders', ['read_orders'], 'https://shopify.dev/docs/api/admin-graphql/latest/queries/orders', 'read_orders covers the standard recent-order window; older orders require read_all_orders.'),
  rule('SG-SCOPE-001', 'order', ['read_orders'], 'https://shopify.dev/docs/api/admin-graphql/latest/queries/order', 'read_orders covers the standard recent-order window; older orders require read_all_orders.'),
  rule('SG-SCOPE-001', 'customers', ['read_customers'], 'https://shopify.dev/docs/api/admin-graphql/latest/queries/customers'),
  rule('SG-SCOPE-001', 'customer', ['read_customers'], 'https://shopify.dev/docs/api/admin-graphql/latest/queries/customer'),
  rule('SG-SCOPE-001', 'inventoryItems', ['read_inventory'], 'https://shopify.dev/docs/api/admin-graphql/latest/queries/inventoryitems'),
  rule('SG-SCOPE-001', 'inventoryLevels', ['read_inventory'], 'https://shopify.dev/docs/api/admin-graphql/latest/queries/inventorylevels'),
  rule('SG-SCOPE-001', 'locations', ['read_locations'], 'https://shopify.dev/docs/api/admin-graphql/latest/queries/locations'),
  rule('SG-SCOPE-001', 'themes', ['read_themes'], 'https://shopify.dev/docs/api/admin-graphql/latest/queries/themes'),
  rule('SG-SCOPE-001', 'files', ['read_files'], 'https://shopify.dev/docs/api/admin-graphql/latest/queries/files'),
  rule('SG-SCOPE-001', 'metaobjects', ['read_metaobjects'], 'https://shopify.dev/docs/api/admin-graphql/latest/queries/metaobjects', 'App-owned metaobjects may have special access behavior; this rule is intentionally conservative for merchant-owned access.'),
  rule('SG-SCOPE-001', 'metaobject', ['read_metaobjects'], 'https://shopify.dev/docs/api/admin-graphql/latest/queries/metaobject', 'App-owned metaobjects may have special access behavior; this rule is intentionally conservative for merchant-owned access.'),
  rule('SG-SCOPE-001', 'cartTransformCreate', ['write_cart_transforms'], 'https://shopify.dev/docs/api/admin-graphql/latest/mutations/carttransformcreate')
];

export const IMPLIED_SCOPES = new Map([
  ['write_products', 'read_products'], ['write_orders', 'read_orders'], ['write_customers', 'read_customers'],
  ['write_inventory', 'read_inventory'], ['write_draft_orders', 'read_draft_orders'], ['write_discounts', 'read_discounts'],
  ['write_themes', 'read_themes'], ['write_content', 'read_content'], ['write_locations', 'read_locations'],
  ['write_files', 'read_files']
]);

export function rulesFor(operation) { return EVIDENCE_REGISTRY.filter((item) => item.operation === operation); }
