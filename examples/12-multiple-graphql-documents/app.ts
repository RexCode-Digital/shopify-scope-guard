const a = admin.graphql(gql(`query One { product(id: "gid://shopify/Product/1") { id } }`));
const b = admin.graphql(graphql(`mutation Two { productUpdate(product: {id: "gid://shopify/Product/1"}) { product { id } } }`));
