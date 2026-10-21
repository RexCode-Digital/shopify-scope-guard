# Rule reference

`SG-SCOPE-001` reports a high-confidence required scope that is not declared or satisfied by a documented implied scope. For classic webhooks, it applies only to `products/update` (`read_products`) and `orders/create` (`read_orders` or `read_marketplace_orders`) when `[webhooks].api_version` is `2026-10`. Evidence is the Shopify [`WebhookSubscriptionTopic` reference](https://shopify.dev/docs/api/admin-graphql/2026-10/enums/WebhookSubscriptionTopic). Declare one of the documented alternatives under `[access_scopes].scopes`; the scanner does not infer scope requirements from `uri`, filters, or query text.

`SG-SCOPE-002` reports a high-confidence operation whose needed scope is declared only as optional. An optional scope is not treated as granted. For webhook alternatives, at least one supported required scope must be declared to produce EVIDENCED status.

`SG-SCOPE-003` reports a documented redundant read scope, such as `write_products` plus `read_products`.

`SG-SCOPE-004` reports that no supported usage requiring a declared scope was evidenced. It does not claim the scope is unused.

`SG-SCOPE-006` reports unmapped Shopify-related code or an unsupported classic webhook topic/API version as UNKNOWN. UNKNOWN is not evidence that no scope is needed.
