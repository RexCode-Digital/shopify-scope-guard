# Changelog

## 0.2.1

- Declare Node 24 for the GitHub Action, matching current runner support; CLI engines remain Node >=20.

- Correct access-scope evidence against official 2026-10 documentation, including write-only analytics mutations and read alternatives.
- Resolve local GraphQL fragments and aliases while preserving unknown evidence for unsupported patterns.
- Reject file symlinks, invalid or ambiguous configurations, and malformed options; bound scanned files.
- Make Action outcomes match failure policy and return actual JSON/SARIF report files.
- Replace registry self-comparison tests with real operation fixtures and validate packaged Action contents.
- Retain GraphQL 16 and Node >=20; GraphQL 17 requires newer Node engines.

## 0.2.0

- Updated the evidence pack to Shopify API `2026-10`, now the latest stable version.
- Added high-confidence static mappings for analytics annotations, reports/AnalyticsTarget, ShopifyQL, and rollout queries.
- Added nested GraphQL path detection for the documented `Shop.analyticsAnnotations` and `Discount.rollouts` surfaces.
- Added privacy-safe 2026-10 evidence fixtures and regression coverage.

## 0.1.0

- Published the offline, deterministic Scope Guard CLI.
- Added the versioned Admin GraphQL evidence registry.
- Added static GraphQL analysis and Shopify app TOML scope comparison.
- Added human, JSON, and SARIF output.
- Added the bundled GitHub Action with finding outputs and configurable failure thresholds.
- Included the Shopify API `2026-07` evidence pack for products, collections, orders, customers, inventory, locations, themes, files, metaobjects, and cart transforms.
