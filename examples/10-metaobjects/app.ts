const response = await admin.graphql(`#graphql
query Metaobjects { metaobjects(first: 10, type: "demo") { nodes { id } } }
`);
