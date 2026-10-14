# CLI

`shopify-scope-guard audit [path]` supports `--format human|json|sarif`, `--config`, `--api-version YYYY-MM`, `--fail-on none|low|medium|high`, `--path`, and `--include`.

```sh
shopify-scope-guard audit
shopify-scope-guard audit examples/02-missing-scope --format json --fail-on high
shopify-scope-guard audit --format sarif
shopify-scope-guard audit --api-version 2027-01 --format json
```

`shopify-scope-guard rules` prints the bundled evidence registry. `shopify-scope-guard explain SG-SCOPE-001` prints matching evidence entries. `shopify-scope-guard version` and `shopify-scope-guard --version` print the package version.

Exit codes are `0` for a passing scan, `1` when the configured `--fail-on` threshold is met, and `2` for usage or scanner errors.

The selected version applies to Admin GraphQL scope evidence. JSON, SARIF, and human output report its status, the latest stable version, current release candidate, and whether the evidence pack applies. Operations stay UNKNOWN outside the verified evidence version; an unlisted version is reported as unverified, not unsupported.
