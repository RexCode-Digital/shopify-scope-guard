# Evidence model

Evidence entries identify the API surface, operation, accepted scope alternatives, introduction/deprecation metadata, verification version, source URL, evidence type, and confidence. The bundled registry is offline and verified against Shopify API `2026-10`. Shopify's official [version schedule](https://shopify.dev/docs/api/usage/versioning), checked on 21 October 2026, lists `2026-10` as latest stable and `2027-01` as the release candidate. API-version status uses the documented `accessibleUntil` deadline where one is known; `2025-10` became unsupported on 16 October 2026 at 15:00 UTC. The `--api-version` option and report metadata identify that status and whether the evidence pack applies. Selecting a release candidate does not apply stable-version mappings: Admin operations remain UNKNOWN until evidence is verified. Versions outside the status snapshot are labelled unverified rather than unsupported.

The 2026-10 additions include statically identifiable GraphQL fields for billing fees, payment-instrument email, market hierarchy, analytics, reports, ShopifyQL, and root or discount-nested rollout connections. Resource-specific access needed by protected rollout payloads is intentionally not inferred.

The analyzer maps the topic-level scopes documented for 18 Shopify Events topics only when the app configuration sets `[events].api_version = "2026-10"`. Unknown topics and other Events versions remain UNKNOWN. This mapping does not infer trigger-specific scope requirements or scopes used by a subscription's custom GraphQL `query`; query and `query_filter` contents are not reported.

Classic webhook evidence is separate from Events evidence. The offline registry contains two high-confidence mappings, both checked against Shopify's `2026-10` [WebhookSubscriptionTopic reference](https://shopify.dev/docs/api/admin-graphql/2026-10/enums/WebhookSubscriptionTopic):

| Topic | Required scope alternatives | Evidence |
| --- | --- | --- |
| `products/update` | `read_products` | The topic reference states that this topic requires `read_products`. |
| `orders/create` | `read_orders`, `read_marketplace_orders` (either) | The topic reference states that either scope satisfies the requirement. |

Shopify's [webhook subscription guide](https://shopify.dev/docs/apps/build/webhooks/subscribe) documents `[[webhooks.subscriptions]]`, its topic lists, and the `webhooks.api_version` field. Classic webhook findings are evaluated only when the selected app configuration sets `webhooks.api_version = "2026-10"`. Both mappings have high confidence, use the existing `SG-SCOPE-001`/`SG-SCOPE-002` missing/optional-scope rules, and were last verified on 21 October 2026. Unknown topics, missing versions, and other versions remain UNKNOWN. The analyzer does not inspect dynamic shop-specific subscriptions created through the Admin API or infer scopes from payload filters and destinations.

Shopify describes `read_marketplace_orders` as an approval-only alternative that returns orders attributed to the app, rather than all store orders. Shopify also documents that write scopes grant read access to the same resource, so `write_marketplace_orders` satisfies the mapped read alternative. These findings describe configured declarations; they do not prove Shopify approval, merchant grants, or protected customer data approval.
