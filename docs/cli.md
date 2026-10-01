# CLI

`shopify-scope-guard audit [path]` supports `--format human|json|sarif`, `--config`, `--fail-on none|low|medium|high`, `--path`, and `--include`.

```sh
shopify-scope-guard audit
shopify-scope-guard audit examples/02-missing-scope --format json --fail-on high
shopify-scope-guard audit --format sarif
```

`shopify-scope-guard rules` prints the bundled evidence registry. `shopify-scope-guard explain SG-SCOPE-001` prints matching evidence entries. `shopify-scope-guard version` and `shopify-scope-guard --version` print the package version.

Exit codes are `0` for a passing scan, `1` when the configured `--fail-on` threshold is met, and `2` for usage or scanner errors.
