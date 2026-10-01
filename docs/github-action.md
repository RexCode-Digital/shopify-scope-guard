# GitHub Action

The bundled Node 20 action runs on the GitHub-hosted runner with `contents: read`. It does not request Shopify credentials, call Shopify, upload source, or execute repository scripts.

Use the immutable release commit for high-assurance workflows:

```yaml
- uses: efegokdemir/shopify-scope-guard@77b615859593999e7e88aa9ff27a2e572d0fbe08 # v0.1.0
```

The `v0.2.0` tag is the immutable patch release. `v0.2` is a mutable compatible minor alias.

Inputs are `path`, `config`, `fail-on`, `format`, and `show-unmapped`. Outputs include the scan outcome, total/high/medium/low/unknown counts, missing-scope count, redundant-scope count, and the SARIF report path when `format: sarif` is selected. See the [action metadata](../action.yml) and the README tables for the exact defaults.
