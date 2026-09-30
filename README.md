# Shopify Scope Guard

Catch missing, redundant, and unproven Shopify access scopes before they become runtime or review problems.

Shopify Scope Guard is an offline, deterministic, read-only static analyzer for Shopify app repositories. It never calls Shopify, needs no credentials, uploads no source, and never executes repository code.

## Install

```sh
npx shopify-scope-guard audit
```

Or install it as a dev dependency:

```sh
npm install --save-dev shopify-scope-guard
npx shopify-scope-guard audit --format json
```

## GitHub Action

```yaml
name: Shopify scopes
on: [push, pull_request]
permissions:
  contents: read
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: efegokdemir/shopify-scope-guard@v0.1.0 # Prefer a full commit SHA for high assurance.
        with:
          fail-on: high
```

The mutable `v0.1` alias follows compatible patch releases. The `v0.1.0` tag is immutable by policy.

## Findings

- **EVIDENCED** means a supported operation has strong static evidence.
- **UNKNOWN** means Shopify-related code could not be safely mapped; it is never treated as unused.
- **NOT EVIDENCED** means: “No supported usage requiring this scope was evidenced.” It does not prove a scope is unused.

The initial evidence pack covers high-confidence Admin GraphQL operations for products, collections, orders, customers, inventory, locations, themes, files, metaobjects, and cart transforms. Evidence is bundled and versioned against Shopify API `2026-07`.

## Related tools

- ChangeGuard: did your Shopify app configuration change?
- Shopify Upgrade Guard: will a Shopify API/platform upgrade affect your code?
- Scope Guard: does your code justify the Shopify permissions you request?

These are independent open-source tools and are not affiliated with Shopify.

## Limitations

Static analysis cannot see runtime-generated queries, external services, arbitrary wrappers, merchant configuration, actual granted scopes, staff permissions, protected customer data approval, or unsupported API surfaces. Review UNKNOWN findings manually.

See [docs/limitations.md](docs/limitations.md), [docs/rule-reference.md](docs/rule-reference.md), and [docs/supported-patterns.md](docs/supported-patterns.md).
