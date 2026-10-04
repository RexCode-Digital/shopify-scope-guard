# Contributing

Contributions are welcome around evidence-backed scope mappings, official Shopify documentation references, false-positive reduction, parser improvements, scanner hardening, and privacy-safe fixtures.

## Development setup

Use Node.js 20 or newer, then install the locked dependencies:

```sh
npm ci
npm test
npm run lint
npm run typecheck
npm run build
```

Before opening a pull request, also run `npm run coverage`, `npm audit --omit=dev --audit-level=high`, and `git diff --check`.

## Evidence and regression rules

- Add a regression test for every bug or rule change.
- Link every new Shopify scope mapping to an official Shopify source.
- Record the evidence version and confidence honestly.
- Keep UNKNOWN distinct from NOT EVIDENCED; static analysis must not claim that a scope is unused.
- Use privacy-safe fixtures with no credentials, tokens, or merchant data.

See the [open issues](https://github.com/RexCode-Digital/shopify-scope-guard/issues) for current opportunities.
