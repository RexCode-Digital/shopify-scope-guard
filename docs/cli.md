# CLI

`shopify-scope-guard audit [path]` supports `--format human|json|sarif`, `--config`, `--api-version YYYY-MM`, `--fail-on none|low|medium|high`, `--path`, and `--include`.

```sh
shopify-scope-guard audit
shopify-scope-guard audit examples/02-missing-scope --format json --fail-on high
shopify-scope-guard audit --format sarif
shopify-scope-guard audit --api-version 2027-01 --format json
```

`shopify-scope-guard rules` prints the bundled evidence registry, including `classicWebhookTopics`. `shopify-scope-guard explain SG-SCOPE-001` prints matching GraphQL and classic webhook evidence entries. `shopify-scope-guard version` and `shopify-scope-guard --version` print the package version.

Exit codes are `0` for a passing scan, `1` when the configured `--fail-on` threshold is met, and `2` for usage or scanner errors.

The `--api-version` value applies to Admin GraphQL scope evidence. Classic webhook and Events mappings use the API version in their respective TOML sections. JSON, SARIF, and human output report the selected Admin GraphQL version and classic webhook EVIDENCED, NOT EVIDENCED, and UNKNOWN counts. Classic webhook topics outside the 2026-10 registry remain UNKNOWN.
