# Shopify Scope Guard

**Catch missing, redundant, and unproven Shopify access scopes before they become runtime or review problems.**

[![npm version](https://img.shields.io/npm/v/shopify-scope-guard?logo=npm)](https://www.npmjs.com/package/shopify-scope-guard) [![npm downloads](https://img.shields.io/npm/dm/shopify-scope-guard?logo=npm)](https://www.npmjs.com/package/shopify-scope-guard) [![CI](https://github.com/efegokdemir/shopify-scope-guard/actions/workflows/ci.yml/badge.svg)](https://github.com/efegokdemir/shopify-scope-guard/actions/workflows/ci.yml) [![CodeQL](https://github.com/efegokdemir/shopify-scope-guard/actions/workflows/codeql.yml/badge.svg)](https://github.com/efegokdemir/shopify-scope-guard/actions/workflows/codeql.yml) [![license](https://img.shields.io/github/license/efegokdemir/shopify-scope-guard)](LICENSE) [![GitHub Marketplace](https://img.shields.io/badge/GitHub%20Marketplace-Shopify%20Scope%20Guard-2088ff?logo=github)](https://github.com/marketplace/actions/shopify-scope-guard)

Shopify Scope Guard is an offline, deterministic, read-only static analyzer for Shopify app repositories. It compares declared access scopes with supported static evidence from repository code and configuration.

> Unofficial open-source developer tooling. Not affiliated with, endorsed by, or certified by Shopify.

## Quick start

Run a scan without installing anything globally:

```sh
npx shopify-scope-guard audit
```

Or install it in a project:

```sh
npm install --save-dev shopify-scope-guard
npx shopify-scope-guard audit --format json
```

## Why Scope Guard?

- **Evidence-backed** — maps supported Admin GraphQL operations to documented access-scope requirements.
- **Offline by default** — ordinary scans do not contact Shopify or require credentials.
- **Deterministic** — the same repository, configuration, and bundled evidence produce the same result.
- **Conservative unknown handling** — unmapped Shopify usage is reported for review, never silently treated as unused.
- **Scope-aware** — detects missing scopes, required/optional mismatches, redundant read scopes, and unproven declarations.
- **CI-ready** — supports human, JSON, and SARIF output plus a bundled GitHub Action.
- **Privacy-first** — does not upload source or execute repository code.

## GitHub Action

```yaml
name: Shopify Scope Guard

on:
  pull_request:
  push:

permissions:
  contents: read

jobs:
  scope-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4
      - uses: efegokdemir/shopify-scope-guard@77b615859593999e7e88aa9ff27a2e572d0fbe08 # v0.1.0
        with:
          fail-on: high
```

The full commit SHA is recommended for supply-chain assurance. The `v0.1.0` tag is the immutable release reference. The `v0.1` tag is a movable compatible minor alias.

### Action inputs

| Input | Purpose | Default |
| --- | --- | --- |
| `path` | Repository path to scan | `.` |
| `config` | Shopify app TOML path | auto-discovered |
| `fail-on` | Minimum finding severity that fails the job | `high` |
| `format` | `human`, `json`, or `sarif` output | `human` |
| `show-unmapped` | Include unsupported Shopify patterns | `false` |

### Action outputs

| Output | Meaning |
| --- | --- |
| `outcome` | `passed` or `failed` according to `fail-on` |
| `finding-count` | Total finding count |
| `high-count` | High-severity finding count |
| `medium-count` | Medium-severity finding count |
| `low-count` | Low-severity finding count |
| `unknown-count` | Unmapped Shopify pattern count |
| `missing-scope-count` | Missing or optional-required scope finding count |
| `redundant-scope-count` | Redundant scope finding count |
| `report` | `scope-guard.sarif` when SARIF output is selected; otherwise empty |

## What it catches today

| Area | Detection |
| --- | --- |
| Missing scopes | Supported operations whose required scope is not declared |
| Required/optional mismatches | Evidence requiring a scope declared as optional |
| Redundant scopes | Read scopes already implied by declared write scopes |
| Unproven declarations | Declared scopes with no supported usage evidenced |
| Unknown usage | Shopify-related code that cannot be safely mapped |
| Admin GraphQL evidence | High-confidence static query and mutation operation matching |
| Shopify app configuration | Required and optional scopes in `shopify.app*.toml` |
| SARIF | SARIF 2.1.0 output for code-scanning workflows |

## Evidence model

**EVIDENCED** means a supported operation has strong static evidence.

**NOT EVIDENCED** means: “No supported usage requiring this scope was evidenced.” It does not prove that a scope is unused.

**UNKNOWN** means Shopify-related code could not be safely mapped to supported evidence. UNKNOWN is deliberately conservative and is never classified as unused.

The bundled high-confidence evidence pack is versioned against Shopify API `2026-07`. It currently covers products, collections, orders, customers, inventory, locations, themes, files, metaobjects, and cart transforms.

## Example output

The following is an illustrative human-readable report using the actual CLI format:

```text
Shopify Scope Guard

Scope audit
────────────
Declared: required 2, optional 1
Observed: evidenced 1, unknown 1
Findings: 3

HIGH SG-SCOPE-001 — write_products
  The productCreate operation requires write_products, which is not declared.
  Evidence: productCreate mutation
  Source: https://shopify.dev/docs/api/admin-graphql/latest/mutations/productcreate
  Location: app/graphql/products.ts:12
  Recommendation: Declare write_products as required, or make the code path conditional on an optional-scope request.

MEDIUM SG-SCOPE-003 — read_products
  write_products already grants read access to this resource; the separate read_products declaration is redundant.
  Evidence: write_products implies read_products
  Location: shopify.app.toml
  Recommendation: Remove read_products from the declarations unless you intentionally replace write_products.

INFO SG-SCOPE-006
  Shopify-related code was found but could not be safely mapped to supported static evidence.
  Location: app/runtime-query.ts:8
  Recommendation: Review the unmapped code manually.
```

## CLI

```sh
# Audit a repository
npx shopify-scope-guard audit

# Machine-readable output
npx shopify-scope-guard audit --format json
npx shopify-scope-guard audit --format sarif

# Inspect bundled evidence
npx shopify-scope-guard rules
npx shopify-scope-guard explain SG-SCOPE-001

# Print the installed version
npx shopify-scope-guard --version
```

The `--fail-on` option accepts `none`, `low`, `medium`, or `high`. A scan exits `1` when a finding meets the selected threshold, `0` when it passes, and `2` for usage or scanner errors.

## Configuration

Scope Guard reads Shopify app TOML configuration from the repository. It supports `[access_scopes]` `scopes` and `optional_scopes` values. The CLI also accepts `--config` for an explicit TOML path; `--path` selects the repository root.

## Security and privacy

- Repository code is never executed.
- Ordinary scans do not contact Shopify.
- Shopify credentials are not required.
- Source is not uploaded and no telemetry is collected.
- Scanned repository input is treated as untrusted.
- File discovery and analysis are bounded by the scanner's supported inputs.
- Analysis is offline by default.

See [SECURITY.md](SECURITY.md), [SUPPORT.md](SUPPORT.md), and the [security model](docs/security.md).

## Limitations and non-goals

Static analysis may not see runtime-generated GraphQL, arbitrary wrappers, external services, merchant configuration, actual merchant-granted scopes, staff permissions, protected customer data approval, or unsupported API surfaces. UNKNOWN findings require manual review. The tool does not prove a scope is unused, replace Shopify schema validation, or replace Shopify App Review.

See [Limitations](docs/limitations.md) and the [supported patterns](docs/supported-patterns.md).

## Related Shopify developer tools

Building or maintaining Shopify apps?

- **[ChangeGuard](https://github.com/efegokdemir/shopify-app-changeguard)** — Review meaningful Shopify app configuration changes before they reach production.
- **[Shopify Upgrade Guard](https://github.com/efegokdemir/shopify-upgrade-guard)** — Catch documented Shopify API and platform upgrade risks before production migrations.
- **[Shopify Scope Guard](https://github.com/efegokdemir/shopify-scope-guard)** — Audit whether declared Shopify access scopes are supported by code evidence.

These are independent open-source tools and are not affiliated with Shopify.

## Documentation

| Documentation | Purpose |
| --- | --- |
| [CLI](docs/cli.md) | CLI usage and output |
| [GitHub Action](docs/github-action.md) | CI integration |
| [Rule reference](docs/rule-reference.md) | Finding and evidence reference |
| [Scope model](docs/scope-model.md) | Declared-scope comparison model |
| [Evidence model](docs/evidence-model.md) | Evidence statuses and sources |
| [Supported patterns](docs/supported-patterns.md) | Static analysis coverage |
| [Limitations](docs/limitations.md) | What cannot be detected |
| [Architecture](docs/architecture.md) | Internal design |
| [Security](docs/security.md) | Security model |

## Contributing

Contributions are welcome around new evidence-backed scope mappings, official Shopify documentation references, false-positive reduction, parser improvements, scanner hardening, and privacy-safe fixtures. See [CONTRIBUTING.md](CONTRIBUTING.md) and the [open issues](https://github.com/efegokdemir/shopify-scope-guard/issues).

## Roadmap

- Expand verified Shopify scope coverage.
- Add additional Admin API surfaces without mixing evidence confidence levels.
- Improve alternative-scope modeling and API-version-aware evidence.
- Reduce false positives and improve UNKNOWN handling.

## License

MIT — see [LICENSE](LICENSE).
