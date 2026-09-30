const response = await admin.graphql(`#graphql
query Products { products(first: 5) { nodes { id title } } }
`);
