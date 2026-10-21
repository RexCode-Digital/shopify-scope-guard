# Shopify Scope Guard

**Catch missing, redundant, and unproven Shopify access scopes before they become runtime or review problems.**

[![npm](https://img.shields.io/npm/v/shopify-scope-guard?logo=npm)](https://www.npmjs.com/package/shopify-scope-guard)
[![npm downloads](https://img.shields.io/npm/dm/shopify-scope-guard?logo=npm)](https://www.npmjs.com/package/shopify-scope-guard)
[![CI](https://github.com/RexCode-Digital/shopify-scope-guard/actions/workflows/ci.yml/badge.svg)](https://github.com/RexCode-Digital/shopify-scope-guard/actions/workflows/ci.yml)
[![CodeQL](https://github.com/RexCode-Digital/shopify-scope-guard/actions/workflows/codeql.yml/badge.svg)](https://github.com/RexCode-Digital/shopify-scope-guard/actions/workflows/codeql.yml)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/RexCode-Digital/shopify-scope-guard/badge)](https://securityscorecards.dev/viewer/?uri=github.com/RexCode-Digital/shopify-scope-guard)
[![license](https://img.shields.io/github/license/RexCode-Digital/shopify-scope-guard)](LICENSE)

Shopify Scope Guard is an offline, deterministic, read-only static analyzer for Shopify app repositories. It compares declared access scopes with supported static evidence from repository code and configuration, then reports missing, redundant, unproven, and unknown scope usage for review.

**No Shopify credentials. No telemetry. No source upload. No Shopify API calls. No repository code execution.**

> Unofficial open-source developer tooling. Not affiliated with, endorsed by, or certified by Shopify.

Maintained by RexCode Digital Ltd.

Part of the **RexCode Shopify developer tools** suite. The CLI requires Node.js 22 or later; the GitHub Action uses Node.js 24. [Releases](https://github.com/RexCode-Digital/shopify-scope-guard/releases) · [npm](https://www.npmjs.com/package/shopify-scope-guard) · [Marketplace](https://github.com/marketplace/actions/shopify-scope-guard)

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
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1

      - uses: RexCode-Digital/shopify-scope-guard@da4d786f22049e2e96728918ebaaa1f362898d84 # v0.4.0
        with:
          fail-on: high
```

For high-assurance workflows, pin third-party Actions to reviewed immutable commit SHAs. `v0.4.0` is the current release and the example uses its resolved commit SHA.

See the [GitHub Action guide](docs/github-action.md).

### Action inputs

| Input | Purpose | Default |
| --- | --- | --- |
| `path` | Repository path to scan | `.` |
| `config` | Shopify app TOML path | auto-discovered |
| `api-version` | Admin GraphQL API version used for evidence applicability | `2026-10` |
| `fail-on` | Minimum finding severity that fails the job | `high` |
| `format` | Output format: `human`, `json`, or `sarif` | `human` |
| `show-unmapped` | Show detailed unmapped patterns in human output | `false` |

### Action outputs

`outcome`, `finding-count`, `high-count`, `medium-count`, `low-count`, `unknown-count`, `missing-scope-count`, `redundant-scope-count`, `api-version`, `api-version-status`, `evidence-version`, `evidence-applicable`, and `report`.

The `report` output is a JSON report file in the runner temporary directory. SARIF format also writes `scope-guard.sarif` there. `outcome` reflects the selected `fail-on` policy.

The pinned v0.4.0 release supports the `api-version` input, version and evidence outputs, and the `--api-version` CLI option. Unsupported API versions, surfaces, and topics remain UNKNOWN.

The Action is bundled and runs on GitHub's `node24` JavaScript Action runtime. Consumer jobs do not install Scope Guard dependencies separately.

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
| Classic webhooks | `products/update` and `orders/create` topic requirements in `[[webhooks.subscriptions]]` |
| Shopify app configuration | Required and optional scopes plus versioned webhook and 2026-10 Events topic requirements in `shopify.app*.toml` |
| SARIF | SARIF 2.1.0 output for code-scanning workflows |

Current high-confidence evidence areas include products, collections, orders, customers, inventory, locations, billing fees, markets, themes, files, metaobjects, cart transforms, analytics annotations, reports, ShopifyQL, rollouts, and documented Events topic scopes.

See the [supported patterns](docs/supported-patterns.md) and [rule reference](docs/rule-reference.md).

## Evidence model

Scope Guard deliberately separates evidence from certainty.

- **EVIDENCED** — a supported operation has strong static evidence for the scope.
- **NOT EVIDENCED** — no supported usage requiring the scope was evidenced. This does **not** prove that the scope is unused.
- **UNKNOWN** — Shopify-related code could not be safely mapped to supported evidence. UNKNOWN is deliberately conservative and is never classified as unused.

The bundled high-confidence evidence pack is versioned against Shopify API `2026-10`. For classic webhooks, EVIDENCED means that a required scope alternative is declared (including a documented write-to-read implication); an optional declaration is NOT EVIDENCED because merchants can decline it. Unmapped topics and unsupported webhook API versions remain UNKNOWN. Evidence is based on documented Shopify access-scope relationships and supported static patterns, not live store permissions.

See the [evidence model](docs/evidence-model.md).

## CLI

```text
shopify-scope-guard audit [--api-version YYYY-MM] [--format human|json|sarif] [--fail-on ...]
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

# Inspect scope evidence for the current release candidate
npx shopify-scope-guard audit --api-version 2027-01 --format json

# Fail when medium-or-higher findings are present
npx shopify-scope-guard audit --fail-on medium

# Inspect the bundled evidence
npx shopify-scope-guard rules
npx shopify-scope-guard explain SG-SCOPE-001
```

The `--fail-on` option accepts `none`, `low`, `medium`, or `high`. A scan exits `1` when a finding meets the selected threshold, `0` when policy passes, and `2` for usage or scanner errors.

Reports identify the selected version's status, latest stable version, current release candidate, and whether the bundled evidence applies. The current pack is verified for `2026-10`; selecting `2027-01` or another version outside that pack leaves Admin operations UNKNOWN rather than applying mismatched rules.

See the [CLI reference](docs/cli.md).

## Configuration

Scope Guard reads Shopify app TOML configuration from the repository. It supports `[access_scopes]` `scopes` and `optional_scopes` values. Classic webhook `topics` are mapped only for the two entries in the offline registry and when `[webhooks].api_version` is `2026-10`; Shopify Events topics are mapped only when `[events].api_version` is `2026-10`. Unsupported topics and API versions remain UNKNOWN. These checks cover topic-level requirements only: they do not infer extra scopes from webhook payload filters or Events triggers and custom queries. Destinations, filters, and query text are never included in findings.

The CLI supports:

- `--path` to select the repository root
- `--config` to select a Shopify app TOML path relative to the scan root

Auto-discovery prefers `shopify.app.toml`, otherwise a single named root configuration. Missing or ambiguous configurations fail explicitly. For nested apps use `audit --path apps/my-app --config shopify.app.production.toml`. Scans are bounded to 2,000 code files and 1 MiB per file; symlinks and bounded-out files appear in `skipped` and require manual review.

Local fragments, inline fragments, and aliases are supported. Admin, Storefront, and Customer Account operations are classified per GraphQL document when a nearby client signal is clear. Storefront operations stay outside Admin scope evidence; Customer Account and ambiguous operations are reported as UNKNOWN. Standalone `.graphql` documents without client context are UNKNOWN until their API surface can be established.

This change raises the CLI minimum to Node.js 22; Node.js 20 is no longer supported. The GraphQL parser dependency is GraphQL.js 17.0.2, which supports Node.js 22 and 24.

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

- **[ChangeGuard](https://github.com/RexCode-Digital/shopify-app-changeguard)** — Review meaningful Shopify app configuration changes before they reach production.
- **[Shopify Upgrade Guard](https://github.com/RexCode-Digital/shopify-upgrade-guard)** — Catch documented Shopify API and platform upgrade risks before production migrations.
- **[Shopify App Review Guard](https://github.com/RexCode-Digital/shopify-app-review-guard)** — Run deterministic preflight checks for Shopify App Store and production readiness.

See the [coordinated workflow example](https://github.com/RexCode-Digital/shopify-app-changeguard/blob/main/docs/ecosystem-workflow.md) to run all four published Actions in one pull-request workflow.

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

Start with [CONTRIBUTING.md](CONTRIBUTING.md) or browse the [open issues](https://github.com/RexCode-Digital/shopify-scope-guard/issues).

## Roadmap

Current priorities include additional verified Shopify scope coverage, additional Admin API surfaces without mixing evidence confidence levels, better alternative-scope modeling, explicit API-version-aware evidence beyond the bundled snapshot, false-positive reduction, improved UNKNOWN handling, and privacy-safe consumer/action fixtures.

See [ROADMAP.md](ROADMAP.md).

## License

MIT — see [LICENSE](LICENSE).

## Immutable SHA usage

The Action example pins the reviewed v0.4.0 release commit. Verify the release reference with:

```bash
git fetch --tags origin && git rev-parse 'v0.4.0^{commit}'
```

Published patch tags are retained; existing minor aliases are movable. A reviewed full commit SHA is the immutable execution reference. Scope Guard 0.4.0 includes the webhook evidence described above for the supported API version; unsupported topics and versions remain UNKNOWN.
