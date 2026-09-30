const storefront = true;
fetch('/api/2026-07/graphql.json', { body: `query { products(first: 1) { nodes { id } } }` });
