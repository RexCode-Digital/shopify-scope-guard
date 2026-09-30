const query = buildQueryFromRuntimeInput(userInput);
await admin.graphql(query);
