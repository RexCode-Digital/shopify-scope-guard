# GitHub Action

The bundled Node 24 Action needs `contents: read`. It does not request Shopify credentials, call Shopify, upload source, or execute repository scripts.

Use the current patch release and resolve its commit when pinning a workflow:

```sh
git fetch --tags origin && git rev-parse 'v0.2.4^{commit}'
```

```yaml
- uses: RexCode-Digital/shopify-scope-guard@30d08c644114399c0ee0257954205b97fb9fcbd3 # v0.2.4
```

Inputs are `path`, `config`, `fail-on`, `format`, and `show-unmapped`. `config` is relative to the project root. The `report` output is a runner-temporary JSON report, or a SARIF report with `format: sarif`. `outcome` follows the selected failure policy. Other outputs include total/high/medium/low/unknown counts, missing-scope count, and redundant-scope count. See [action metadata](../action.yml) for defaults.
