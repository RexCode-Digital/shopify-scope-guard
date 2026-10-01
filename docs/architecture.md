# Architecture

Scope Guard keeps discovery, parsing, evidence, reporting, and failure policy separate:

1. File discovery finds supported Shopify app TOML and source documents.
2. The TOML parser reads declared required and optional scopes.
3. Surface detection identifies supported Admin GraphQL documents and excludes non-Admin surfaces.
4. The GraphQL parser extracts operations and fields without executing application code.
5. The evidence registry maps supported operations to documented scope requirements.
6. The analyzer compares declarations with observations and emits stable findings.
7. Human, JSON, SARIF, and Action output adapters publish the result.

All implementation modules live under `src/`. Repository code is treated as untrusted input and is never evaluated.
