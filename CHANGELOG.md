# Changelog

## Unreleased

## 0.4.0

- Add offline scope evidence for classic `products/update` and `orders/create` subscriptions in `shopify.app.toml`, with separate EVIDENCED, NOT EVIDENCED, and UNKNOWN results from Shopify Events.
- Expose classic webhook evidence counts in human, JSON, SARIF, and GitHub Action outputs without including destinations or filter values.
- Upgrade GraphQL.js to 17.0.2.
- Breaking: require Node.js 22 or newer for the CLI; Node.js 20 is no longer supported. The Action remains on Node.js 24; CI tests Node.js 22 and 24 plus the required Node.js 20 check.
- Map `write_marketplace_orders` to its implied marketplace read scope for `orders/create`, while preserving UNKNOWN results and optional-scope uncertainty.
- Correct the standalone GraphQL document support note and refresh the immutable Action example to the v0.3.0 commit.

## 0.3.0

- Classify Admin, Storefront, Customer Account, and ambiguous GraphQL operations independently using nearby source context.
- Add explicit Shopify API version status and evidence applicability to CLI, Action, JSON, human, and SARIF reports.
- Make standalone GraphQL documents without API client context UNKNOWN and restrict explicit configuration scans to the selected app root.

## 0.2.4

- Add versioned 2026-10 access-scope evidence for payment instrument email, billing fee details, market relationships, and documented Events topics.

## 0.2.3

- Refine npm search metadata and Action description for Shopify OAuth/API access-scope review.
- Correct the README runtime note and refresh the pinned Action release.

## 0.2.2

- Refresh published npm metadata to the canonical RexCode-Digital repository and issue tracker.
- Preserve the existing package name, license, author attribution, and runtime behavior.

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
