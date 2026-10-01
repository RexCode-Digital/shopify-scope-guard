# Shopify Scope Guard

**Catch missing, redundant, and unproven Shopify access scopes before they become runtime or review problems.**

[![npm](https://img.shields.io/npm/v/shopify-scope-guard?logo=npm)](https://www.npmjs.com/package/shopify-scope-guard)
[![npm downloads](https://img.shields.io/npm/dm/shopify-scope-guard?logo=npm)](https://www.npmjs.com/package/shopify-scope-guard)
[![CI](https://github.com/efegokdemir/shopify-scope-guard/actions/workflows/ci.yml/badge.svg)](https://github.com/efegokdemir/shopify-scope-guard/actions/workflows/ci.yml)
[![CodeQL](https://github.com/efegokdemir/shopify-scope-guard/actions/workflows/codeql.yml/badge.svg)](https://github.com/efegokdemir/shopify-scope-guard/actions/workflows/codeql.yml)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/efegokdemir/shopify-scope-guard/badge)](https://securityscorecards.dev/viewer/?uri=github.com/efegokdemir/shopify-scope-guard)
[![license](https://img.shields.io/github/license/efegokdemir/shopify-scope-guard)](LICENSE)

Shopify Scope Guard is an offline, deterministic, read-only static analyzer for Shopify app repositories. It compares declared access scopes with supported static evidence from repository code and configuration, then reports missing, redundant, unproven, and unknown scope usage for review.

**No Shopify credentials. No telemetry. No source upload. No Shopify API calls. No repository code execution.**

> Unofficial open-source developer tooling. Not affiliated with, endorsed by, or certified by Shopify.

## Quick start

Run a scan without installing anything globally:

```bash
npx shopify-scope-guard audit
```

Or install it in a project:

```bash
npm install --save-dev shopify-scope-guard
npx shopify-scope-guard audit
```

JSON output:

```bash
npx shopify-scope-guard audit --format json
```

SARIF output for code-scanning workflows:

```bash
npx shopify-scope-guard audit --format sarif
```

## Why Scope Guard?

Shopify app permissions can drift away from the code that actually uses Shopify APIs. Scope Guard gives reviewers a deterministic, evidence-backed view of that relationship without requiring store access or Shopify credentials.

- **Evidence-backed** — maps supported Shopify API operations to documented access-scope requirements.
- **Offline by design** — ordinary scans require no Shopify credentials, store access, or network service.
- **Deterministic** — the same repository, configuration, and bundled evidence produce the same result.
- **Conservative** — UNKNOWN usage is reported for review and is never silently treated as unused.
- **Scope-aware** — detects missing scopes, required/optional mismatches, redundant read scopes, and unproven declarations.
- **CI-ready** — human, JSON, and SARIF output plus a bundled GitHub Action.
- **Privacy-first** — does not upload source or execute repository code.

## GitHub Action

A minimal pull-request gate:

```yaml
name: Shopify Scope Guard

on:
  pull_request:

permissions:
  contents: read

jobs:
  scope-guard:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4

      - uses: efegokdemir/shopify-scope-guard@77b615859593999e7e88aa9ff27a2e572d0fbe08 # v0.1.0
        with:
          fail-on: high
```

For high-assurance workflows, pin third-party Actions to reviewed immutable commit SHAs. Scope Guard also publishes the movable compatible minor alias `v0.1`; `v0.1.0` is the immutable patch release reference.

See the [GitHub Action guide](docs/github-action.md).

### Action inputs

| Input | Purpose | Default |
| --- | --- | --- |
| `path` | Repository path to scan | `.` |
| `config` | Shopify app TOML path | auto-discovered |
| `fail-on` | Minimum finding severity that fails the job | `high` |
| `format` | Output format: `human`, `json`, or `sarif` | `human` |
| `show-unmapped` | Include unsupported Shopify patterns | `false` |

### Action outputs

`outcome`, `finding-count`, `high-count`, `medium-count`, `low-count`, `unknown-count`, `missing-scope-count`, `redundant-scope-count`, and `report`.

The Action is bundled and runs on GitHub's `node20` JavaScript Action runtime. Consumer jobs do not install Scope Guard dependencies separately.

## What it catches today

The current evidence pack is intentionally focused on high-confidence Shopify API and app-configuration mappings.

| Area | Detection |
| --- | --- |
| Missing scopes | Supported operations whose required scope is not declared |
| Required/optional mismatches | Evidence requiring a scope declared as optional |
| Redundant scopes | Read scopes already implied by declared write scopes |
| Unproven declarations | Declared scopes with no supported usage evidenced |
| Unknown usage | Shopify-related code that cannot be safely mapped to supported evidence |
| Admin GraphQL | Supported query and mutation operations matched against documented scope requirements |
| Shopify app configuration | Required and optional scopes in `shopify.app*.toml` |
| SARIF | SARIF 2.1.0 output for code-scanning workflows |

Current high-confidence evidence areas include products, collections, orders, customers, inventory, locations, themes, files, metaobjects, and cart transforms.

See the [supported patterns](docs/supported-patterns.md) and [rule reference](docs/rule-reference.md).

## Evidence model

Scope Guard deliberately separates evidence from certainty.

- **EVIDENCED** — a supported operation has strong static evidence for the scope.
- **NOT EVIDENCED** — no supported usage requiring the scope was evidenced. This does **not** prove that the scope is unused.
- **UNKNOWN** — Shopify-related code could not be safely mapped to supported evidence. UNKNOWN is deliberately conservative and is never classified as unused.

The bundled high-confidence evidence pack is versioned against Shopify API `2026-07`. Evidence is based on documented Shopify access-scope relationships and supported static patterns, not live store permissions.

See the [evidence model](docs/evidence-model.md).

## CLI

```text
shopify-scope-guard audit [--format human|json|sarif] [--fail-on ...]
shopify-scope-guard rules
shopify-scope-guard explain SG-SCOPE-001
shopify-scope-guard --version
```

Examples:

```bash
# Human-readable scan
npx shopify-scope-guard audit

# Machine-readable output
npx shopify-scope-guard audit --format json

# SARIF for code-scanning workflows
npx shopify-scope-guard audit --format sarif

# Fail when medium-or-higher findings are present
npx shopify-scope-guard audit --fail-on medium

# Inspect the bundled evidence
npx shopify-scope-guard rules
npx shopify-scope-guard explain SG-SCOPE-001
```

The `--fail-on` option accepts `none`, `low`, `medium`, or `high`. A scan exits `1` when a finding meets the selected threshold, `0` when policy passes, and `2` for usage or scanner errors.

See the [CLI reference](docs/cli.md).

## Configuration

Scope Guard reads Shopify app TOML configuration from the repository. It supports `[access_scopes]` `scopes` and `optional_scopes` values.

The CLI supports:

- `--path` to select the repository root
- `--config` to select an explicit Shopify app TOML path

## Security and privacy

Scope Guard treats repository content as untrusted input and is intentionally narrow.

It:

- does not execute scanned repository code
- does not call Shopify APIs during ordinary scans
- does not require Shopify credentials
- does not upload source or collect telemetry
- uses bounded, supported static analysis
- keeps analysis offline by default

See [SECURITY.md](SECURITY.md), [SUPPORT.md](SUPPORT.md), and the [security model](docs/security.md).

## Non-goals

Scope Guard does **not**:

- inspect the scopes actually granted to a merchant
- inspect staff permissions or protected-customer-data approval
- see every runtime-generated GraphQL operation
- understand every custom wrapper or external service
- guarantee that a scope is unused
- replace Shopify schema validation or Shopify App Review
- provide complete coverage of every Shopify API surface

UNKNOWN findings require manual review.

See [Limitations](docs/limitations.md).

## Related Shopify developer tools

Building or maintaining Shopify apps?

- **[ChangeGuard](https://github.com/efegokdemir/shopify-app-changeguard)** — Review meaningful Shopify app configuration changes before they reach production.
- **[Shopify Upgrade Guard](https://github.com/efegokdemir/shopify-upgrade-guard)** — Catch documented Shopify API and platform upgrade risks before production migrations.
- **[Shopify Scope Guard](https://github.com/efegokdemir/shopify-scope-guard)** — Audit whether declared Shopify access scopes are supported by offline code evidence.

These are independent open-source tools and are not affiliated with Shopify.

## Contributing

Contributions are welcome, especially around evidence-backed scope mappings, official Shopify documentation references, false-positive reduction, parser improvements, scanner hardening, and privacy-safe fixtures.

A Shopify-specific rule should include:

1. an official Shopify evidence source
2. the affected API/version where relevant
3. bounded deterministic detection
4. a positive regression test
5. a false-positive or unchanged case where appropriate
6. honest evidence confidence

Start with [CONTRIBUTING.md](CONTRIBUTING.md) or browse the [open issues](https://github.com/efegokdemir/shopify-scope-guard/issues).

## Roadmap

Current priorities include additional verified Shopify scope coverage, additional Admin API surfaces without mixing evidence confidence levels, better alternative-scope modeling, API-version-aware evidence, false-positive reduction, improved UNKNOWN handling, and privacy-safe consumer/action fixtures.

See [ROADMAP.md](ROADMAP.md).

## License

MIT — see [LICENSE](LICENSE).
