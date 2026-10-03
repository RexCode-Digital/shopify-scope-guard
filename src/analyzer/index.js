import { TOOL_VERSION } from '../version.js';
import fs from 'node:fs';
import path from 'node:path';
import { parseConfig, regularFile } from '../config/index.js';
import { extractGraphQL } from '../graphql/index.js';
import { EVIDENCE_REGISTRY, EVIDENCE_VERSION, EVIDENCE_SOURCES, IMPLIED_SCOPES, rulesFor } from '../evidence/registry.js';

const DEFAULT_IGNORES = new Set(['.git', 'node_modules', 'vendor', 'dist', 'build', 'coverage', '.cache', 'tmp', 'fixtures']);
const CODE_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx', '.graphql', '.gql']);
const MAX_FILE_BYTES = 1024 * 1024;

function walk(root, skipped, current = root, out = []) {
  for (const entry of fs.readdirSync(current, { withFileTypes: true }).sort((a,b) => a.name.localeCompare(b.name))) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(current, entry.name);
    if (entry.isSymbolicLink()) { skipped.push({ file: path.relative(root, full), reason: 'Symbolic link' }); continue; }
    if (entry.isDirectory()) { if (!DEFAULT_IGNORES.has(entry.name)) walk(root, skipped, full, out); continue; }
    if (!entry.isFile() || !CODE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) continue;
    if (out.length >= 2000 || fs.lstatSync(full).size > MAX_FILE_BYTES) { skipped.push({ file: path.relative(root, full), reason: 'Analysis limit' }); continue; }
    out.push(full);
  }
  return out;
}

function finding(ruleId, severity, confidence, scope, file, line, explanation, evidence, source, remediation) {
  return { ruleId, severity, confidence, scope, file: file ?? null, line: line ?? null, explanation, evidence, source, remediation };
}

export function audit({ root = '.', configPath, include, exclude = [] } = {}) {
  const absoluteRoot = path.resolve(root);
  if (!fs.lstatSync(absoluteRoot).isDirectory()) throw new Error('Scan root must be a regular directory');
  const candidates = fs.readdirSync(absoluteRoot).filter(f => /^shopify\.app(?:\..+)?\.toml$/.test(f)).sort();
  if (!configPath && candidates.length > 1 && !candidates.includes('shopify.app.toml')) throw new Error('Multiple app configurations found; select one with --config');
  const selected = configPath ?? (candidates.includes('shopify.app.toml') ? 'shopify.app.toml' : candidates[0]);
  if (!selected) throw new Error('Shopify app configuration not found; select one with --config');
  const configFile = path.resolve(absoluteRoot, selected);
  regularFile(absoluteRoot, configFile);
  const config = parseConfig(configFile);
  const skipped = [];
  const files = walk(absoluteRoot, skipped).filter(file => !exclude.some(value => file.includes(value)) && (!include || file.includes(include)));
  const observations = [], findings = [], unknown = [];
  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    const surface = /\/admin\/api\/[^/]+\/graphql\.json|admin\.graphql|authenticate\.admin|currentAppInstallation/.test(text) ? 'admin-graphql' : (/storefront|unauthenticated_read_/.test(text) ? 'storefront' : /\.(graphql|gql)$/i.test(file) ? 'admin-graphql' : null);
    if (!surface && /graphql|shopify/i.test(text)) { unknown.push({ file: path.relative(absoluteRoot, file), reason: 'Shopify-related code could not be assigned to a supported API surface.' }); continue; }
    if (surface === 'storefront') continue;
    const operations = extractGraphQL(text, file);
    if (surface === 'admin-graphql' && operations.length === 0 && /(admin\.graphql|client\.(query|request)|graphql\s*\()/.test(text)) { unknown.push({ file: path.relative(absoluteRoot, file), line: 1, reason: 'Shopify Admin GraphQL client usage was found, but the query was not a static document.' }); }
    for (const op of operations) {
      if (op.parseError) { unknown.push({ file: path.relative(absoluteRoot, file), line: op.line, reason: 'GraphQL-like text could not be parsed safely.' }); continue; }
      for (const field of op.fields) {
        const rules = rulesFor(field.path, op.type);
        if (!rules.length) { if (!field.path.includes('.') && !['shop', '__typename'].includes(field.path)) unknown.push({ file: path.relative(absoluteRoot, file), line: field.line, reason: 'GraphQL root operation is outside the bundled scope registry.' }); continue; }
        for (const item of rules) observations.push({ ...item, operationType: op.type, file, line: field.line, operationName: op.name });
      }
    }
  }
  const observedScopes = new Set(observations.flatMap(o => o.requires.anyOf));
  const satisfied = scope => config.required.includes(scope) || [...config.required].some(s => IMPLIED_SCOPES.get(s) === scope);
  for (const observation of observations) {
    if (observation.requires.anyOf.some(satisfied)) continue;
    const optionalScope = observation.requires.anyOf.find(s => config.optional.includes(s) || config.optional.some(write => IMPLIED_SCOPES.get(write) === s));
    const scope = optionalScope ?? observation.requires.anyOf[0];
    const severity = 'high';
    findings.push(finding(Boolean(optionalScope) ? 'SG-SCOPE-002' : 'SG-SCOPE-001', severity, observation.confidence, scope, path.relative(absoluteRoot, observation.file).replaceAll(path.sep, '/'), observation.line, Boolean(optionalScope) ? `The code evidences ${scope}, but it is declared optional.` : `The ${observation.operation} operation requires one of ${observation.requires.anyOf.join(', ')}, and none is declared as required.`, `${observation.operation} ${observation.operationType}`, observation.source, `Declare ${scope} as required, or make the code path conditional on an optional-scope request.`));
  }
  for (const [write, read] of IMPLIED_SCOPES) if (config.required.includes(write) && (config.required.includes(read) || config.optional.includes(read))) findings.push(finding('SG-SCOPE-003', 'medium', 'high', read, path.relative(absoluteRoot, configFile).replaceAll(path.sep, '/'), null, `${write} already grants read access to this resource; the separate ${read} declaration is redundant.`, `${write} implies ${read}`, EVIDENCE_SOURCES.scopes, `Remove ${read} from the declarations unless you intentionally replace ${write}.`));
  for (const scope of config.required) if (!observedScopes.has(scope) && ![...observedScopes].some(s => IMPLIED_SCOPES.get(s) === scope) && ![...IMPLIED_SCOPES.entries()].some(([write, read]) => write === scope && observedScopes.has(read))) findings.push(finding('SG-SCOPE-004', 'low', 'high', scope, path.relative(absoluteRoot, configFile).replaceAll(path.sep, '/'), null, `No supported usage requiring ${scope} was evidenced.`, 'No matching supported operation found', EVIDENCE_SOURCES.scopes, `Review whether ${scope} is still needed; static analysis cannot prove it is unused.`));
  for (const scope of config.optional) if (!observedScopes.has(scope)) findings.push(finding('SG-SCOPE-004', 'low', 'high', scope, path.relative(absoluteRoot, configFile).replaceAll(path.sep, '/'), null, `No supported usage requiring optional scope ${scope} was evidenced.`, 'No matching supported operation found', EVIDENCE_SOURCES.scopes, `Review the optional feature path; this result does not prove the scope is unused.`));
  if (unknown.length) findings.push(finding('SG-SCOPE-006', 'info', 'low', null, unknown[0].file, unknown[0].line, 'Shopify-related code was found but could not be safely mapped to supported static evidence.', unknown.map(item => item.reason).join('; '), EVIDENCE_SOURCES.scopes, 'Review the unmapped code manually.'));
  findings.sort((a, b) => `${a.severity}:${a.ruleId}:${a.file}:${a.line}`.localeCompare(`${b.severity}:${b.ruleId}:${b.file}:${b.line}`));
  return { tool: { name: 'shopify-scope-guard', version: TOOL_VERSION }, evidence: { api: 'admin-graphql', version: EVIDENCE_VERSION, source: EVIDENCE_SOURCES.versioning }, summary: { declaredRequired: config.required.length, declaredOptional: config.optional.length, evidenced: observedScopes.size, unknown: unknown.length, findingCount: findings.length }, scopes: { required: config.required, optional: config.optional }, observations: observations.map(o => ({ operation: o.operation, scope: o.requires.anyOf, file: path.relative(absoluteRoot, o.file).replaceAll(path.sep, '/'), line: o.line })), findings, unknown, skipped };
}
