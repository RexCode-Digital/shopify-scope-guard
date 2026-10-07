# Evidence model

Evidence entries identify the API surface, operation, accepted scope alternatives, introduction/deprecation metadata, verification version, source URL, evidence type, and confidence. The bundled registry is offline and currently verified against Shopify API `2026-10`, the latest stable version as of October 1, 2026.

The 2026-10 additions include statically identifiable GraphQL fields for billing fees, payment-instrument email, market hierarchy, analytics, reports, ShopifyQL, and root or discount-nested rollout connections. Resource-specific access needed by protected rollout payloads is intentionally not inferred.

The analyzer also maps the topic-level scopes printed on Shopify's 2026-10 Events topic references for the 18 bundled topics. It does this only when the app configuration sets `[events].api_version = "2026-10"`. Unknown topics and other Events versions remain UNKNOWN. This mapping does not infer trigger-specific scope requirements, or scopes used by a subscription's custom GraphQL `query`; query and `query_filter` contents are not reported.
