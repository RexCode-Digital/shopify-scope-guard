export const EVIDENCE_VERSION = '2026-10';
export const EVIDENCE_SOURCES = {
  scopes: 'https://shopify.dev/docs/apps/build/authentication-authorization/manage-access-scopes',
  accessScopes: 'https://shopify.dev/docs/api/usage/access-scopes',
  versioning: 'https://shopify.dev/docs/api/usage/versioning'
};

const rule = (ruleId, operation, anyOf, source, notes = '', introduced = '2023-01') => ({
  ruleId, api: 'admin-graphql', operation, operationType: source.includes('/mutations/') ? 'mutation' : 'query', requires: { anyOf }, introduced,
  lastVerified: EVIDENCE_VERSION, source, evidenceType: 'official-api-reference', confidence: 'high', notes
});

export const EVIDENCE_REGISTRY = [
  rule('SG-SCOPE-001', 'productCreate', ['write_products'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/productcreate'),
  rule('SG-SCOPE-001', 'productUpdate', ['write_products'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/productupdate'),
  rule('SG-SCOPE-001', 'productSet', ['write_products'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/productset'),
  rule('SG-SCOPE-001', 'productOptionsCreate', ['write_products'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/productoptionscreate'),
  rule('SG-SCOPE-001', 'collectionCreate', ['write_products'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/collectioncreate'),
  rule('SG-SCOPE-001', 'products', ['read_products'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/queries/products'),
  rule('SG-SCOPE-001', 'product', ['read_products'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/queries/product'),
  rule('SG-SCOPE-001', 'productVariants', ['read_products'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/queries/productvariants'),
  rule('SG-SCOPE-001', 'orders', ['read_orders', 'read_marketplace_orders', 'read_buyer_membership_orders', 'read_quick_sale'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/queries/orders', 'read_orders covers the standard recent-order window; older orders require read_all_orders.'),
  rule('SG-SCOPE-001', 'order', ['read_orders', 'read_marketplace_orders', 'read_buyer_membership_orders', 'read_quick_sale'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/queries/order', 'read_orders covers the standard recent-order window; older orders require read_all_orders.'),
  rule('SG-SCOPE-001', 'customers', ['read_customers'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/queries/customers'),
  rule('SG-SCOPE-001', 'customer', ['read_customers'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/queries/customer'),
  rule('SG-SCOPE-001', 'inventoryItem', ['read_inventory', 'read_products'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/queries/inventoryItem'),
  rule('SG-SCOPE-001', 'inventoryItems.nodes.inventoryLevels', ['read_inventory'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/objects/InventoryLevel'),
  rule('SG-SCOPE-001', 'inventoryItem.inventoryLevels', ['read_inventory'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/objects/InventoryLevel'),
  rule('SG-SCOPE-001', 'inventoryItems', ['read_inventory', 'read_products'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/queries/inventoryitems'),
  rule('SG-SCOPE-001', 'locations', ['read_locations', 'read_inventory', 'read_markets_home'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/queries/locations'),
  rule('SG-SCOPE-001', 'themes', ['read_themes'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/queries/themes'),
  rule('SG-SCOPE-001', 'files', ['read_files'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/queries/files'),
  rule('SG-SCOPE-001', 'metaobjects', ['read_metaobjects'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/queries/metaobjects', 'App-owned metaobjects may have special access behavior; this rule is intentionally conservative for merchant-owned access.'),
  rule('SG-SCOPE-001', 'metaobject', ['read_metaobjects'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/queries/metaobject', 'App-owned metaobjects may have special access behavior; this rule is intentionally conservative for merchant-owned access.'),
  rule('SG-SCOPE-001', 'cartTransformCreate', ['write_cart_transforms'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/carttransformcreate'),
  rule('SG-SCOPE-001', 'paymentInstrumentSendAddEmail', ['write_customers'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/paymentInstrumentSendAddEmail', 'The mutation also requires staff create/edit customer permission and read access to the mandate resource.', '2026-10'),
  rule('SG-SCOPE-001', 'feeDetails', ['read_billing'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/queries/feeDetails', '', '2026-10'),
  rule('SG-SCOPE-001', 'marketRelationships', ['read_markets'], 'https://shopify.dev/changelog/posts/market-relationships', '', '2026-10'),
  rule('SG-SCOPE-001', 'marketRelationshipsStatus', ['read_markets'], 'https://shopify.dev/changelog/posts/market-relationships', '', '2026-10'),
  rule('SG-SCOPE-001', 'marketRelationships.nodes.parentMarket', ['read_markets'], 'https://shopify.dev/changelog/posts/market-relationships', '', '2026-10'),
  rule('SG-SCOPE-001', 'marketRelationships.nodes.childMarket', ['read_markets'], 'https://shopify.dev/changelog/posts/market-relationships', '', '2026-10'),
  rule('SG-SCOPE-001', 'market.parentMarkets', ['read_markets'], 'https://shopify.dev/changelog/posts/market-relationships', '', '2026-10'),
  rule('SG-SCOPE-001', 'market.parentMarketsCount', ['read_markets'], 'https://shopify.dev/changelog/posts/market-relationships', '', '2026-10'),
  rule('SG-SCOPE-001', 'market.childMarkets', ['read_markets'], 'https://shopify.dev/changelog/posts/market-relationships', '', '2026-10'),
  rule('SG-SCOPE-001', 'market.childMarketsCount', ['read_markets'], 'https://shopify.dev/changelog/posts/market-relationships', '', '2026-10'),
  rule('SG-SCOPE-001', 'markets.nodes.parentMarkets', ['read_markets'], 'https://shopify.dev/changelog/posts/market-relationships', '', '2026-10'),
  rule('SG-SCOPE-001', 'markets.nodes.parentMarketsCount', ['read_markets'], 'https://shopify.dev/changelog/posts/market-relationships', '', '2026-10'),
  rule('SG-SCOPE-001', 'markets.nodes.childMarkets', ['read_markets'], 'https://shopify.dev/changelog/posts/market-relationships', '', '2026-10'),
  rule('SG-SCOPE-001', 'markets.nodes.childMarketsCount', ['read_markets'], 'https://shopify.dev/changelog/posts/market-relationships', '', '2026-10'),
  rule('SG-SCOPE-001', 'discountNode', ['read_discounts'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/queries/discountNode'),
  rule('SG-SCOPE-001', 'discountNode.discount.rollouts', ['read_rollouts'], 'https://shopify.dev/docs/api/usage/access-scopes', 'Discount.rollouts is available in Admin GraphQL 2026-10+. Reading the discount itself still requires its resource scope, such as read_discounts.', '2026-10'),
  rule('SG-SCOPE-001', 'discountNodes', ['read_discounts'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/queries/discountNodes'),
  rule('SG-SCOPE-001', 'discountNodes.nodes.discount.rollouts', ['read_rollouts'], 'https://shopify.dev/docs/api/usage/access-scopes', 'Discount.rollouts is available in Admin GraphQL 2026-10+. Reading the discount itself still requires its resource scope, such as read_discounts.', '2026-10'),
  rule('SG-SCOPE-001', 'analyticsAnnotationCreate', ['write_analytics_annotations'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/analyticsannotationcreate', '', '2026-10'),
  rule('SG-SCOPE-001', 'analyticsAnnotationUpdate', ['write_analytics_annotations'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/analyticsannotationupdate', '', '2026-10'),
  rule('SG-SCOPE-001', 'analyticsAnnotationDelete', ['write_analytics_annotations'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/analyticsannotationdelete', '', '2026-10'),
  rule('SG-SCOPE-001', 'shop.analyticsAnnotations', ['read_analytics_annotations', 'write_analytics_annotations'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/objects/analyticsannotation', 'The nested Shop.analyticsAnnotations field is statically mapped; unrelated AnalyticsAnnotation type selections are intentionally not inferred.', '2026-10'),
  rule('SG-SCOPE-001', 'analyticsTargets', ['read_reports', 'write_reports'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/queries/analyticstargets', '', '2026-10'),
  rule('SG-SCOPE-001', 'analyticsTargetCreate', ['write_reports'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/analyticstargetcreate', '', '2026-10'),
  rule('SG-SCOPE-001', 'analyticsTargetUpdate', ['write_reports'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/analyticstargetupdate', '', '2026-10'),
  rule('SG-SCOPE-001', 'analyticsTargetsDelete', ['write_reports'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/analyticstargetsdelete', '', '2026-10'),
  rule('SG-SCOPE-001', 'shopifyqlQuery', ['read_reports', 'write_reports'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/queries/shopifyqlquery', '', '2026-10'),
  rule('SG-SCOPE-001', 'rollout', ['read_rollouts'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/queries/rollout', 'Reading protected discount payloads within a rollout can additionally require read_discounts; that resource-specific scope is not inferred here.', '2026-10'),
  rule('SG-SCOPE-001', 'rollouts', ['read_rollouts'], 'https://shopify.dev/docs/api/admin-graphql/2026-10/queries/rollouts', 'Reading protected discount payloads within a rollout can additionally require read_discounts; that resource-specific scope is not inferred here.', '2026-10'),
];

// Each scope is copied from the topic's current official Events reference. The
// mapping is deliberately versioned to 2026-10 and covers only the topic-level
// requirement; trigger-specific extra scopes are not inferred.
const eventsTopic = (scopes, slug) => ({ scopes, introduced: '2026-10', source: `https://shopify.dev/docs/api/events/latest/${slug}` });
export const EVENTS_TOPIC_EVIDENCE = Object.freeze({
  Article: eventsTopic(['read_content', 'read_online_store_pages'], 'article'),
  Blog: eventsTopic(['read_content', 'read_online_store_pages'], 'blog'),
  Collection: eventsTopic(['read_products'], 'collection'),
  Company: eventsTopic(['read_companies'], 'company'),
  Customer: eventsTopic(['read_customers'], 'customer'),
  FulfillmentOrder: eventsTopic(['read_assigned_fulfillment_orders', 'read_marketplace_fulfillment_orders', 'read_merchant_managed_fulfillment_orders', 'read_third_party_fulfillment_orders'], 'fulfillment-order'),
  InventoryItem: eventsTopic(['read_inventory'], 'inventory-item'),
  InventoryShipment: eventsTopic(['read_inventory_shipments'], 'inventory-shipment'),
  InventoryTransfer: eventsTopic(['read_inventory_transfers'], 'inventory-transfer'),
  Location: eventsTopic(['read_locations'], 'location'),
  MetafieldDefinition: eventsTopic(['read_content'], 'metafield-definition'),
  Metaobject: eventsTopic(['read_metaobjects'], 'metaobject'),
  MetaobjectDefinition: eventsTopic(['read_metaobject_definitions'], 'metaobject-definition'),
  Order: eventsTopic(['read_orders', 'read_marketplace_orders', 'read_buyer_membership_orders', 'read_quick_sale'], 'order'),
  Page: eventsTopic(['read_content', 'read_online_store_pages'], 'page'),
  Product: eventsTopic(['read_products'], 'product'),
  Refund: eventsTopic(['read_orders', 'read_marketplace_orders', 'read_buyer_membership_orders'], 'refund'),
  Return: eventsTopic(['read_returns', 'read_marketplace_returns'], 'return')
});

export const IMPLIED_SCOPES = new Map([
  ['write_products', 'read_products'], ['write_orders', 'read_orders'], ['write_customers', 'read_customers'],
  ['write_inventory', 'read_inventory'], ['write_draft_orders', 'read_draft_orders'], ['write_discounts', 'read_discounts'],
  ['write_themes', 'read_themes'], ['write_content', 'read_content'], ['write_locations', 'read_locations'],
  ['write_files', 'read_files'],
  ['write_analytics_annotations', 'read_analytics_annotations'],
  ['write_reports', 'read_reports']
]);

export function rulesFor(operation, type) { return EVIDENCE_REGISTRY.filter(item => item.operation === operation && (!type || item.operationType === type)); }
