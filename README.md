# Shopify Scope Guard

Compare requested Shopify app scopes with supported static evidence to review permission changes.

**RexCode Open Source · Shopify developer tools**

[![npm](https://img.shields.io/npm/v/shopify-scope-guard?logo=npm)](https://www.npmjs.com/package/shopify-scope-guard)
[![CI](https://github.com/RexCode-Digital/shopify-scope-guard/actions/workflows/ci.yml/badge.svg)](https://github.com/RexCode-Digital/shopify-scope-guard/actions/workflows/ci.yml)
[![CodeQL](https://github.com/RexCode-Digital/shopify-scope-guard/actions/workflows/codeql.yml/badge.svg)](https://github.com/RexCode-Digital/shopify-scope-guard/actions/workflows/codeql.yml)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/RexCode-Digital/shopify-scope-guard/badge)](https://securityscorecards.dev/viewer/?uri=github.com/RexCode-Digital/shopify-scope-guard)
[![Node.js 22+](https://img.shields.io/badge/Node.js-22+-22B8B2?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MIT licence](https://img.shields.io/github/license/RexCode-Digital/shopify-scope-guard)](LICENSE)

Scope Guard compares declared required and optional scopes with supported evidence in local Shopify app code. It reports missing, redundant and uncertain cases while keeping unsupported patterns visibly unknown.

## Features

- Analyses supported Admin GraphQL operations and documented Shopify webhook evidence.
- Keeps classic webhook topics separate from Shopify Events.
- Distinguishes EVIDENCED, NOT EVIDENCED and UNKNOWN; UNKNOWN is not treated as unused.
- Supports human, JSON and SARIF output with versioned offline evidence.

## Install and run

Requires Node.js 22 or later.

```bash
npm install --save-dev shopify-scope-guard
npx shopify-scope-guard audit --api-version 2026-10
```

The bundled evidence pack applies to Admin GraphQL API version 2026-10. Unsupported versions remain unknown. See [supported patterns](docs/supported-patterns.md) and the [CLI guide](docs/cli.md).

## GitHub Action

Pin the released v0.4.0 commit:

```yaml
name: Review Shopify app scopes
on: [pull_request]
permissions:
  contents: read

jobs:
  scope-guard:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
      - uses: RexCode-Digital/shopify-scope-guard@da4d786f22049e2e96728918ebaaa1f362898d84 # v0.4.0
        with:
          api-version: 2026-10
          format: human
          fail-on: high
```

Inputs include `path`, `config`, `api-version`, `fail-on`, `format` and `show-unmapped`. Outputs report the policy outcome, finding and uncertainty counts, selected API version, evidence applicability, scope counts and webhook evidence counts. See [action.yml](action.yml).

## Example output

```text
Shopify Scope Guard
Admin GraphQL target: 2026-10 (stable); bundled evidence: 2026-10 (applicable)
Findings: 1

HIGH SG-SCOPE-001 — write_products
  The productCreate operation requires one of write_products, and none is declared as required.
  Evidence: productCreate mutation
  Source: https://shopify.dev/docs/api/admin-graphql/2026-10/mutations/productcreate
  Location: app.ts:2
  Recommendation: Declare write_products as required, or make the code path conditional on an optional-scope request.
```

This finding comes from the repository's synthetic `examples/02-missing-scope` fixture.

## Supported capabilities and evidence

Scope Guard supports a bounded set of Admin GraphQL operations and versioned evidence for classic webhooks and Shopify Events. Optional scopes are not treated as granted. Unknown topics, unsupported API versions, ambiguous GraphQL clients and unmapped operations remain UNKNOWN. Findings do not include webhook destinations, filters or query text.

See the [evidence model](docs/evidence-model.md), [scope model](docs/scope-model.md), and [rules](docs/rule-reference.md).

## Limitations and privacy

The tool does not inspect merchant grants, staff permissions, protected-customer-data approval, runtime-generated operations or every custom wrapper. NOT EVIDENCED does not prove a scope is unused. It does not call Shopify APIs, execute repository code, require credentials or upload source. Review UNKNOWN and skipped files manually.

## Documentation

- [Getting started](docs/cli.md)
- [CLI guide](docs/cli.md)
- [Supported patterns](docs/supported-patterns.md)
- [Evidence model](docs/evidence-model.md)
- [Limitations](docs/limitations.md)

## Related RexCode OSS tools

- [ChangeGuard](https://github.com/RexCode-Digital/shopify-app-changeguard) reviews app configuration changes.
- [Shopify Upgrade Guard](https://github.com/RexCode-Digital/shopify-upgrade-guard) checks API and platform migration risks.
- [Shopify App Review Guard](https://github.com/RexCode-Digital/shopify-app-review-guard) checks App Store and production-readiness evidence.

See the [combined workflow](https://github.com/RexCode-Digital/shopify-app-changeguard/blob/main/docs/ecosystem-workflow.md) to run all four published Actions.

## Contributing and support

Read [CONTRIBUTING.md](CONTRIBUTING.md) and the [RexCode Open Source standards](https://github.com/RexCode-Digital/.github/blob/main/docs/oss/standards.md). For help, use [SUPPORT.md](SUPPORT.md) or the [issue tracker](https://github.com/RexCode-Digital/shopify-scope-guard/issues).

## Security

Use [SECURITY.md](SECURITY.md) for private vulnerability reporting. Never post credentials, private source or merchant data in a public issue.

## Licence and affiliation

MIT licensed. Shopify's names and marks belong to Shopify. Scope Guard is independent open-source software, not affiliated with, endorsed by, or certified by Shopify.