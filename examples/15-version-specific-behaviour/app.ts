fetch('https://demo.myshopify.com/admin/api/2026-07/graphql.json', { body: JSON.stringify({query: `query Orders { orders(first: 1) { nodes { id } } }`}) });
