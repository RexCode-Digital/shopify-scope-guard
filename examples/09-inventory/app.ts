const response = await admin.graphql(`#graphql
query Inventory { inventoryItems(first: 10) { nodes { id inventoryLevels(first: 10) { nodes { id } } } } }
`);
