# Architecture

File discovery, TOML parsing, GraphQL parsing, surface detection, evidence matching, findings, output, and exit policy are separate modules under `src/`. GraphQL syntax is parsed with the `graphql` reference parser; application code is never evaluated.
