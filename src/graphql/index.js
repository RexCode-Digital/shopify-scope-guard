import { parse, visit, Kind } from 'graphql';

export function parseGraphQL(source, file) {
  const document = parse(source, { noLocation: false });
  const operations = [];
  const collectFields = (selectionSet, parentPath = '') => (selectionSet?.selections ?? [])
    .filter(selection => selection.kind === Kind.FIELD)
    .flatMap(field => {
      const path = parentPath ? `${parentPath}.${field.name.value}` : field.name.value;
      return [{ name: field.name.value, path, line: field.loc?.startToken?.line ?? 1, column: field.loc?.startToken?.column ?? 1 }, ...collectFields(field.selectionSet, path)];
    });
  visit(document, { OperationDefinition(node) {
    const fields = collectFields(node.selectionSet);
    operations.push({ type: node.operation, name: node.name?.value ?? null, fields, file, line: node.loc?.startToken?.line ?? 1 });
  }});
  return operations;
}

export function extractGraphQL(text, file) {
  const documents = [];
  if (file.endsWith('.graphql') || file.endsWith('.gql')) documents.push(text);
  const patterns = [ /#graphql\s*([\s\S]*?)(?=`|\`\`\`|\n\s*\)|;)/g, /(?:graphql|gql)\s*\(\s*`([\s\S]*?)`/g, /query\s*[:=]\s*`([\s\S]*?)`/g ];
  for (const pattern of patterns) for (const match of text.matchAll(pattern)) documents.push(match[1]);
  const result = [];
  for (const document of documents) { try { result.push(...parseGraphQL(document, file)); } catch { result.push({ type: 'unknown', name: null, fields: [], file, line: 1, parseError: true }); } }
  return result;
}
