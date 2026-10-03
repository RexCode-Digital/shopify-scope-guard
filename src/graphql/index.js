import { parse, Kind } from 'graphql';

export function parseGraphQL(source, file, lineOffset = 0) {
  const document = parse(source, { noLocation: false, maxTokens: 50000 });
  const fragments = new Map(document.definitions.filter(d => d.kind === Kind.FRAGMENT_DEFINITION).map(d => [d.name.value, d]));
  let visited = 0;
  const collectFields = (selectionSet, parentPath = '', stack = []) => (selectionSet?.selections ?? []).flatMap(selection => {
    if (++visited > 50000) throw new Error('GraphQL selection limit exceeded');
    if (selection.kind === Kind.INLINE_FRAGMENT) return collectFields(selection.selectionSet, parentPath, stack);
    if (selection.kind === Kind.FRAGMENT_SPREAD) {
      const name = selection.name.value;
      if (stack.includes(name) || !fragments.has(name)) throw new Error('Unresolved or cyclic GraphQL fragment');
      return collectFields(fragments.get(name).selectionSet, parentPath, [...stack, name]);
    }
    const fieldPath = parentPath ? `${parentPath}.${selection.name.value}` : selection.name.value;
    return [{ name: selection.name.value, path: fieldPath, line: (selection.loc?.startToken?.line ?? 1) + lineOffset, column: selection.loc?.startToken?.column ?? 1 }, ...collectFields(selection.selectionSet, fieldPath, stack)];
  });
  return document.definitions.filter(d => d.kind === Kind.OPERATION_DEFINITION).map(node => ({ type: node.operation, name: node.name?.value ?? null, fields: collectFields(node.selectionSet), file, line: (node.loc?.startToken?.line ?? 1) + lineOffset }));
}
export function extractGraphQL(text, file) {
  const documents = new Map();
  if (/\.(graphql|gql)$/i.test(file)) documents.set(0, text);
  else {
    const patterns = [ /#graphql\s*([\s\S]*?)(?=`)/g, /(?:graphql|gql)\s*(?:\(\s*)?`([\s\S]*?)`/g, /query\s*[:=]\s*`([\s\S]*?)`/g ];
    for (const pattern of patterns) for (const match of text.matchAll(pattern)) {
      const offset = match.index + match[0].indexOf(match[1]);
      // A #graphql template may also match the call pattern; retain one document.
      const source = match[1].replace(/^#graphql\s*/, '');
      if (![...documents.values()].some(d => d.replace(/^#graphql\s*/, '') === source)) documents.set(offset, match[1]);
    }
  }
  const result = [];
  for (const [offset, source] of documents) {
    try { result.push(...parseGraphQL(source, file, text.slice(0, offset).split('\n').length - 1)); }
    catch { result.push({ type: 'unknown', name: null, fields: [], file, line: text.slice(0, offset).split('\n').length, parseError: true }); }
  }
  return result;
}
