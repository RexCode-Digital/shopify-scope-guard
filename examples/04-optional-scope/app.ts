const response = await admin.graphql(`#graphql
mutation Create { productCreate(product: {title: "Demo"}) { product { id } } }
`);
