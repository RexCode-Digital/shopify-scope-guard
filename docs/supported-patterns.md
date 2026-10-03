# Supported patterns

The analyzer reads `.graphql`, `.gql`, JavaScript, TypeScript, JSX, and TSX. It recognizes GraphQL documents, `#graphql` templates, `graphql()`/`gql()` templates, common `admin.graphql()` usage, and visible Admin GraphQL endpoints. Storefront-like code is kept separate from Admin GraphQL evidence. For 2026-10 evidence, documented nested paths such as `shop.analyticsAnnotations` and `inventoryItems.nodes.inventoryLevels` are matched without treating unrelated nested response fields as root operations.

Local fragments, inline fragments, and aliases are resolved. Unresolved fragments, dynamic documents, and unsupported operations remain unknown evidence. Standalone GraphQL files are assumed to use Admin GraphQL; explicit Storefront signals take precedence.
