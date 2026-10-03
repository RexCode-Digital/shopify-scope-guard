# GitHub Action

The bundled Node 24 Action needs `contents: read`. It does not request Shopify credentials, call Shopify, upload source, or execute repository scripts.

Use the current patch release and resolve its commit when pinning a workflow:

```sh
gh api repos/efegokdemir/shopify-scope-guard/git/ref/tags/v0.2.1 --jq .object.sha
```

```yaml
- uses: efegokdemir/shopify-scope-guard@4c9077c1b150f54ee488b8996aa7afeee740bae4 # v0.2.1
```

Inputs are `path`, `config`, `fail-on`, `format`, and `show-unmapped`. `config` is relative to the project root. The `report` output is a runner-temporary JSON report, or a SARIF report with `format: sarif`. `outcome` follows the selected failure policy. Other outputs include total/high/medium/low/unknown counts, missing-scope count, and redundant-scope count. See [action metadata](../action.yml) for defaults.
