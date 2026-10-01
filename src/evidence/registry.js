export const EVIDENCE_VERSION = '2026-10';
export const EVIDENCE_SOURCES = {
  scopes: 'https://shopify.dev/docs/apps/build/authentication-authorization/manage-access-scopes',
  accessScopes: 'https://shopify.dev/docs/api/usage/access-scopes',
  versioning: 'https://shopify.dev/docs/api/usage/versioning'
};

const rule = (ruleId, operation, anyOf, source, notes = '', introduced = '2023-01') => ({
  ruleId, api: 'admin-graphql', operation, requires: { anyOf }, introduced,
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
  rule('SG-SCOPE-001', 'cartTransformCreate', ['write_cart_transforms'], 'https://shopify.dev/docs/api/admin-graphql/latest/mutations/carttransformcreate'),
  rule('SG-SCOPE-001', 'analyticsAnnotationCreate', ['read_analytics_annotations', 'write_analytics_annotations'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/analyticsannotationcreate', '', '2026-10'),
  rule('SG-SCOPE-001', 'analyticsAnnotationUpdate', ['read_analytics_annotations', 'write_analytics_annotations'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/analyticsannotationupdate', '', '2026-10'),
  rule('SG-SCOPE-001', 'analyticsAnnotationDelete', ['read_analytics_annotations', 'write_analytics_annotations'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/analyticsannotationdelete', '', '2026-10'),
  rule('SG-SCOPE-001', 'shop.analyticsAnnotations', ['read_analytics_annotations', 'write_analytics_annotations'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/objects/analyticsannotation', 'The nested Shop.analyticsAnnotations field is statically mapped; unrelated AnalyticsAnnotation type selections are intentionally not inferred.', '2026-10'),
  rule('SG-SCOPE-001', 'analyticsTargets', ['read_reports', 'write_reports'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/queries/analyticstargets', '', '2026-10'),
  rule('SG-SCOPE-001', 'analyticsTargetCreate', ['read_reports', 'write_reports'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/analyticstargetcreate', '', '2026-10'),
  rule('SG-SCOPE-001', 'analyticsTargetUpdate', ['read_reports', 'write_reports'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/analyticstargetupdate', '', '2026-10'),
  rule('SG-SCOPE-001', 'analyticsTargetsDelete', ['read_reports', 'write_reports'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/analyticstargetsdelete', '', '2026-10'),
  rule('SG-SCOPE-001', 'shopifyqlQuery', ['read_reports', 'write_reports'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/queries/shopifyqlquery', '', '2026-10'),
  rule('SG-SCOPE-001', 'rollout', ['read_rollouts'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/queries/rollout', 'Reading protected discount payloads within a rollout can additionally require read_discounts; that resource-specific scope is not inferred here.', '2026-10'),
  rule('SG-SCOPE-001', 'rollouts', ['read_rollouts'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/queries/rollouts', 'Reading protected discount payloads within a rollout can additionally require read_discounts; that resource-specific scope is not inferred here.', '2026-10'),
  rule('SG-SCOPE-001', 'discounts.rollouts', ['read_rollouts'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/objects/discount', 'The rollout connection is mapped to read_rollouts; the parent discount resource may require its own access scope.', '2026-10')
];

export const IMPLIED_SCOPES = new Map([
  ['write_products', 'read_products'], ['write_orders', 'read_orders'], ['write_customers', 'read_customers'],
  ['write_inventory', 'read_inventory'], ['write_draft_orders', 'read_draft_orders'], ['write_discounts', 'read_discounts'],
  ['write_themes', 'read_themes'], ['write_content', 'read_content'], ['write_locations', 'read_locations'],
  ['write_files', 'read_files'],
  ['write_analytics_annotations', 'read_analytics_annotations'],
  ['write_reports', 'read_reports']
]);

export function rulesFor(operation) { return EVIDENCE_REGISTRY.filter((item) => item.operation === operation); }
