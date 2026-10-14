const response = await admin.graphql(`#graphql
query Products { products(first: 1) { nodes { id } } }
`);
