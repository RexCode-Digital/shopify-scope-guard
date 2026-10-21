# GitHub Action

The bundled Node 24 Action needs `contents: read`. It does not request Shopify credentials, call Shopify, upload source, or execute repository scripts.

Use the current release and resolve its commit when pinning a workflow:

```sh
git fetch --tags origin && git rev-parse 'v0.4.0^{commit}'
```

```yaml
- uses: RexCode-Digital/shopify-scope-guard@da4d786f22049e2e96728918ebaaa1f362898d84 # v0.4.0
```

Inputs are `path`, `config`, `fail-on`, `format`, and `show-unmapped`. `config` is relative to the project root. The `report` output is a runner-temporary JSON report, or a SARIF report with `format: sarif`. `outcome` follows the selected failure policy. Other outputs include total/high/medium/low/unknown counts, missing-scope and redundant-scope counts, and `webhook-evidenced-count`, `webhook-not-evidenced-count`, and `webhook-unknown-count`. The webhook counts cover only version-matched topics in the offline registry; see [action metadata](../action.yml) for defaults.
