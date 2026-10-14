const response = await admin.graphql(`#graphql
mutation Update { productUpdate(product: {id: "gid://shopify/Product/1"}) { product { id } } }
`);
