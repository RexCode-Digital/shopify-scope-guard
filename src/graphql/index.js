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

function maskComments(source) {
  let output = '', quote = '', escaped = false;
  for (let index = 0; index < source.length; index++) {
    const character = source[index], next = source[index + 1];
    if (quote) {
      output += character;
      if (escaped) escaped = false;
      else if (character === '\\') escaped = true;
      else if (character === quote) quote = '';
      continue;
    }
    if (character === '"' || character === "'" || character === String.fromCharCode(96)) { quote = character; output += character; continue; }
    if (character === '/' && next === '/') {
      output += '  '; index++;
      while (index + 1 < source.length && source[index + 1] !== '\n') { index++; output += ' '; }
      continue;
    }
    if (character === '/' && next === '*') {
      output += '  '; index++;
      while (index + 1 < source.length && !(source[index] === '*' && source[index + 1] === '/')) { index++; output += source[index] === '\n' ? '\n' : ' '; }
      if (index + 1 < source.length) { index++; output += ' '; }
      continue;
    }
    output += character;
  }
  return output;
}

export function extractGraphQL(text, file) {
  const documents = [];
  if (/\.(graphql|gql)$/i.test(file)) documents.push({ offset: 0, source: text, end: text.length });
  else {
    const patterns = [ /#graphql\s*([\s\S]*?)(?=`)/g, /(?:graphql|gql)\s*(?:\(\s*)?`([\s\S]*?)`/g, /query\s*[:=]\s*`([\s\S]*?)`/g ];
    for (const pattern of patterns) for (const match of text.matchAll(pattern)) {
      const raw = match[1], rawOffset = match.index + match[0].indexOf(raw);
      const prefix = raw.match(/^#graphql\s*/)?.[0] ?? '';
      const source = raw.slice(prefix.length), offset = rawOffset + prefix.length;
      if (!documents.some(document => document.source === source)) documents.push({ offset, source, end: offset + source.length });
    }
  }
  const result = [];
  for (const document of documents) {
    const lineOffset = text.slice(0, document.offset).split('\n').length - 1;
    let sourceContext = '';
    if (!/\.(graphql|gql)$/i.test(file)) {
      const templateStart = text.lastIndexOf('`', document.offset);
      const templateEnd = text.indexOf('`', document.end);
      if (templateStart >= 0 && templateEnd >= 0) {
        const statementStart = Math.max(text.lastIndexOf(';', templateStart) + 1, templateStart - 180);
        const before = text.slice(statementStart, templateStart);
        sourceContext = maskComments(before);
      }
    }
    try {
      result.push(...parseGraphQL(document.source, file, lineOffset).map(operation => ({
        ...operation,
        sourceContext,
      })));
    } catch { result.push({ type: 'unknown', name: null, fields: [], file, line: text.slice(0, document.offset).split('\n').length, parseError: true, sourceContext: '' }); }
  }
  return result;
}
