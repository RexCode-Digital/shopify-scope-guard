const response = await admin.graphql(`#graphql
query Customers { customers(first: 10) { nodes { id } } }
`);
