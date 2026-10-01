# Evidence model

Evidence entries identify the API surface, operation, accepted scope alternatives, introduction/deprecation metadata, verification version, source URL, evidence type, and confidence. The bundled registry is offline and currently verified against Shopify API `2026-10`, the latest stable version as of October 1, 2026.

The 2026-10 additions are limited to statically identifiable GraphQL fields: analytics annotation mutations and `Shop.analyticsAnnotations`, AnalyticsTarget queries and mutations, `shopifyqlQuery`, and root or discount-nested rollout connections. Resource-specific access needed by protected rollout payloads is intentionally not inferred.
