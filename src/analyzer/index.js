import { TOOL_VERSION } from '../version.js';
import fs from 'node:fs';
import path from 'node:path';
import { parseConfig, regularFile } from '../config/index.js';
import { extractGraphQL } from '../graphql/index.js';
import { EVIDENCE_REGISTRY, EVIDENCE_VERSION, EVIDENCE_SOURCES, EVENTS_TOPIC_EVIDENCE, CLASSIC_WEBHOOK_TOPIC_EVIDENCE, IMPLIED_SCOPES, API_VERSION_INTELLIGENCE, rulesFor } from '../evidence/registry.js';

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

function discoverAppConfigs(root, current = root, result = []) {
  for (const entry of fs.readdirSync(current, { withFileTypes: true }).sort((a,b) => a.name.localeCompare(b.name))) {
    if (entry.name.startsWith('.') || DEFAULT_IGNORES.has(entry.name)) continue;
    const full = path.join(current, entry.name);
    if (entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) discoverAppConfigs(root, full, result);
    else if (entry.isFile() && /^shopify\.app(?:\..+)?\.toml$/.test(entry.name)) result.push(full);
  }
  return result;
}

function operationSurface(operation) {
  const context = operation.sourceContext ?? '';
  const evidence = [];
  if (/\badmin\s*\.\s*graphql\s*\(|\bauthenticate\s*\.\s*admin\b|\/admin\/api\/\d{4}-\d{2}\/graphql\.json|\bcurrentAppInstallation\b/i.test(context)) evidence.push('admin-graphql');
  if (/\bstorefront\s*\.\s*graphql\s*\(|\bunauthenticated\s*\.\s*storefront\b|storefront-access-token|https?:\/\/[^/\s]+\/api\/\d{4}-\d{2}\/graphql\.json/i.test(context)) evidence.push('storefront-graphql');
  if (/\bcustomerAccount\s*\.\s*graphql\s*\(|\bunauthenticated\s*\.\s*customerAccount\b|\/customer\/api\//i.test(context)) evidence.push('customer-account-graphql');
  return evidence.length === 1 ? evidence[0] : null;
}

function apiStatus(version, now = new Date()) {
  const status = API_VERSION_INTELLIGENCE.statuses[version];
  if (status === 'stable') {
    const accessibleUntil = API_VERSION_INTELLIGENCE.accessibleUntil[version];
    if (accessibleUntil && now.getTime() >= Date.parse(accessibleUntil)) return 'unsupported';
  }
  return status ?? 'unverified';
}

export function audit({ root = '.', configPath, include, exclude = [], apiVersion = API_VERSION_INTELLIGENCE.latestStable, now = new Date() } = {}) {
  if (typeof apiVersion !== 'string' || !/^(?:\d{4}-\d{2}|unstable)$/.test(apiVersion)) throw new Error('API version must use YYYY-MM or unstable');
  let absoluteRoot = path.resolve(root);
  if (!fs.lstatSync(absoluteRoot).isDirectory()) throw new Error('Scan root must be a regular directory');
  let configFile;
  if (configPath) {
    configFile = path.resolve(absoluteRoot, configPath);
    regularFile(absoluteRoot, configFile);
    absoluteRoot = path.dirname(configFile);
    if (discoverAppConfigs(absoluteRoot).some(file => path.dirname(file) !== absoluteRoot)) throw new Error('Nested Shopify app roots found; select one with --path or --config');
  } else {
    const candidates = fs.readdirSync(absoluteRoot).filter(f => /^shopify\.app(?:\..+)?\.toml$/.test(f)).sort();
    const nestedRoots = [...new Set(discoverAppConfigs(absoluteRoot).map(file => path.dirname(file)).filter(dir => dir !== absoluteRoot))];
    if (nestedRoots.length) throw new Error('Nested Shopify app roots found; select one with --path or --config');
    if (candidates.length > 1 && !candidates.includes('shopify.app.toml')) throw new Error('Multiple app configurations found; select one with --config');
    const selected = candidates.includes('shopify.app.toml') ? 'shopify.app.toml' : candidates[0];
    if (!selected) throw new Error('Shopify app configuration not found; select one with --config');
    configFile = path.resolve(absoluteRoot, selected);
    regularFile(absoluteRoot, configFile);
  }
  const config = parseConfig(configFile);
  const skipped = [];
  const files = walk(absoluteRoot, skipped).filter(file => !exclude.some(value => file.includes(value)) && (!include || file.includes(include)));
  const observations = [], findings = [], unknown = [];
  const classicWebhookSummary = { evidenced: 0, notEvidenced: 0, unknown: 0 };
  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    const operations = extractGraphQL(text, file);
    if (operations.length === 0 && /(?:admin|storefront|customerAccount)\.graphql|\/admin\/api\/|\/customer\/api\//i.test(text)) { unknown.push({ file: path.relative(absoluteRoot, file), line: 1, reason: 'Shopify API client usage was found, but the query was not a static document.' }); }
    for (const op of operations) {
      if (op.parseError) { unknown.push({ file: path.relative(absoluteRoot, file), line: op.line, reason: 'GraphQL-like text could not be parsed safely.' }); continue; }
      const surface = operationSurface(op);
      if (!surface) { unknown.push({ file: path.relative(absoluteRoot, file), line: op.line, reason: 'GraphQL operation could not be assigned to one supported API surface.' }); continue; }
      if (surface === 'storefront-graphql') continue;
      if (surface === 'customer-account-graphql') {
        unknown.push({ file: path.relative(absoluteRoot, file), line: op.line, reason: 'Customer Account GraphQL is identifiable but is outside the Admin GraphQL scope evidence pack.' });
        continue;
      }
      if (apiVersion !== EVIDENCE_VERSION) {
        unknown.push({ file: path.relative(absoluteRoot, file), line: op.line, reason: `Admin GraphQL scope evidence is verified for ${EVIDENCE_VERSION} only; selected API version ${apiVersion} is ${apiStatus(apiVersion, now)}.` });
        continue;
      }
      for (const field of op.fields) {
        const rules = rulesFor(field.path, op.type);
        if (!rules.length) { if (!field.path.includes('.') && !['shop', '__typename'].includes(field.path)) unknown.push({ file: path.relative(absoluteRoot, file), line: field.line, reason: 'GraphQL root operation is outside the bundled scope registry.' }); continue; }
        for (const item of rules) observations.push({ ...item, apiSurface: surface, operationType: op.type, file, line: field.line, operationName: op.name });
      }
    }
  }
  if (config.events !== null) {
    const events = config.events;
    if (!events || typeof events !== 'object' || Array.isArray(events) || !Array.isArray(events.subscription)) {
      unknown.push({ file: path.relative(absoluteRoot, configFile).replaceAll(path.sep, '/'), line: null, reason: 'Events subscriptions could not be mapped from the app configuration.' });
    } else for (const subscription of events.subscription) {
      if (!subscription || typeof subscription !== 'object' || Array.isArray(subscription) || typeof subscription.topic !== 'string') {
        unknown.push({ file: path.relative(absoluteRoot, configFile).replaceAll(path.sep, '/'), line: null, reason: 'An Events subscription topic could not be mapped safely.' });
        continue;
      }
      const evidence = events.api_version === EVIDENCE_VERSION && Object.hasOwn(EVENTS_TOPIC_EVIDENCE, subscription.topic) ? EVENTS_TOPIC_EVIDENCE[subscription.topic] : null;
      if (!evidence) {
        unknown.push({ file: path.relative(absoluteRoot, configFile).replaceAll(path.sep, '/'), line: null, reason: 'An Events topic or API version has no bundled 2026-10 scope evidence.' });
        continue;
      }
      observations.push({ ruleId: 'SG-SCOPE-001', operation: `events.subscription.${subscription.topic}`, operationType: 'events', requires: { anyOf: evidence.scopes }, source: evidence.source, confidence: 'high', file: configFile, line: null });
    }
  }
  if (config.webhooks !== null) {
    const webhooks = config.webhooks;
    const configRelative = path.relative(absoluteRoot, configFile).replaceAll(path.sep, '/');
    const addWebhookUnknown = reason => {
      classicWebhookSummary.unknown++;
      unknown.push({ file: configRelative, line: null, reason });
    };
    if (!webhooks || typeof webhooks !== 'object' || Array.isArray(webhooks)) {
      addWebhookUnknown('Classic webhook subscriptions could not be mapped from the app configuration.');
    } else if (webhooks.subscriptions !== undefined && !Array.isArray(webhooks.subscriptions)) {
      addWebhookUnknown('Classic webhook subscriptions could not be mapped from the app configuration.');
    } else {
      const seenTopics = new Set();
      for (const subscription of webhooks.subscriptions ?? []) {
        if (!subscription || typeof subscription !== 'object' || Array.isArray(subscription)) {
          addWebhookUnknown('A classic webhook subscription could not be mapped safely.');
          continue;
        }
        if (!Array.isArray(subscription.topics) || subscription.topics.length === 0) {
          // Compliance-only subscriptions use `compliance_topics`, which is a
          // separate configuration surface and is not scope-mapped here.
          addWebhookUnknown('A classic webhook subscription has no supported topic list.');
          continue;
        }
        for (const topic of subscription.topics) {
          if (typeof topic !== 'string' || !topic || topic.length > 200) {
            addWebhookUnknown('A classic webhook topic could not be mapped safely.');
            continue;
          }
          if (seenTopics.has(topic)) continue;
          seenTopics.add(topic);
          const evidence = Object.hasOwn(CLASSIC_WEBHOOK_TOPIC_EVIDENCE, topic) ? CLASSIC_WEBHOOK_TOPIC_EVIDENCE[topic] : null;
          if (!evidence || !evidence.apiVersions.includes(webhooks.api_version)) {
            addWebhookUnknown('A classic webhook topic or API version has no bundled scope evidence.');
            continue;
          }
          const requiredScopeIsDeclared = evidence.scopes.some(scope => config.required.includes(scope) || config.required.some(write => IMPLIED_SCOPES.get(write) === scope));
          const evidenceStatus = requiredScopeIsDeclared ? 'EVIDENCED' : 'NOT EVIDENCED';
          classicWebhookSummary[requiredScopeIsDeclared ? 'evidenced' : 'notEvidenced']++;
          observations.push({
            ruleId: evidence.ruleId,
            operation: `webhooks.subscriptions.${topic}`,
            operationType: 'webhook',
            apiSurface: 'classic-webhook',
            requires: { anyOf: evidence.scopes },
            source: evidence.source,
            confidence: evidence.confidence,
            evidenceStatus,
            evidenceVersion: evidence.evidenceVersion,
            file: configFile,
            line: null,
          });
        }
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
    const remediation = observation.apiSurface === 'classic-webhook'
      ? `Declare one of ${observation.requires.anyOf.join(', ')} as required. Optional scopes are not treated as granted.`
      : `Declare ${scope} as required, or make the code path conditional on an optional-scope request.`;
    findings.push(finding(Boolean(optionalScope) ? 'SG-SCOPE-002' : 'SG-SCOPE-001', severity, observation.confidence, scope, path.relative(absoluteRoot, observation.file).replaceAll(path.sep, '/'), observation.line, Boolean(optionalScope) ? `The code evidences ${scope}, but it is declared optional.` : `The ${observation.operation} operation requires one of ${observation.requires.anyOf.join(', ')}, and none is declared as required.`, `${observation.operation} ${observation.operationType}`, observation.source, remediation));
  }
  for (const [write, read] of IMPLIED_SCOPES) if (config.required.includes(write) && (config.required.includes(read) || config.optional.includes(read))) findings.push(finding('SG-SCOPE-003', 'medium', 'high', read, path.relative(absoluteRoot, configFile).replaceAll(path.sep, '/'), null, `${write} already grants read access to this resource; the separate ${read} declaration is redundant.`, `${write} implies ${read}`, EVIDENCE_SOURCES.scopes, `Remove ${read} from the declarations unless you intentionally replace ${write}.`));
  for (const scope of config.required) if (!observedScopes.has(scope) && ![...observedScopes].some(s => IMPLIED_SCOPES.get(s) === scope) && ![...IMPLIED_SCOPES.entries()].some(([write, read]) => write === scope && observedScopes.has(read))) findings.push(finding('SG-SCOPE-004', 'low', 'high', scope, path.relative(absoluteRoot, configFile).replaceAll(path.sep, '/'), null, `No supported usage requiring ${scope} was evidenced.`, 'No matching supported operation found', EVIDENCE_SOURCES.scopes, `Review whether ${scope} is still needed; static analysis cannot prove it is unused.`));
  for (const scope of config.optional) if (!observedScopes.has(scope)) findings.push(finding('SG-SCOPE-004', 'low', 'high', scope, path.relative(absoluteRoot, configFile).replaceAll(path.sep, '/'), null, `No supported usage requiring optional scope ${scope} was evidenced.`, 'No matching supported operation found', EVIDENCE_SOURCES.scopes, `Review the optional feature path; this result does not prove the scope is unused.`));
  if (unknown.length) findings.push(finding('SG-SCOPE-006', 'info', 'low', null, unknown[0].file, unknown[0].line, 'Shopify-related code was found but could not be safely mapped to supported static evidence.', unknown.map(item => item.reason).join('; '), EVIDENCE_SOURCES.scopes, 'Review the unmapped code manually.'));
  findings.sort((a, b) => `${a.severity}:${a.ruleId}:${a.file}:${a.line}`.localeCompare(`${b.severity}:${b.ruleId}:${b.file}:${b.line}`));
  return {
    tool: { name: 'shopify-scope-guard', version: TOOL_VERSION },
    evidence: { api: 'admin-graphql', version: EVIDENCE_VERSION, source: EVIDENCE_SOURCES.versioning },
    apiVersion: {
      selected: apiVersion,
      status: apiStatus(apiVersion, now),
      latestStable: API_VERSION_INTELLIGENCE.latestStable,
      releaseCandidate: API_VERSION_INTELLIGENCE.releaseCandidate,
      evidenceVersion: EVIDENCE_VERSION,
      evidenceApplicable: apiVersion === EVIDENCE_VERSION,
      source: API_VERSION_INTELLIGENCE.source,
    },
    summary: { declaredRequired: config.required.length, declaredOptional: config.optional.length, evidenced: observedScopes.size, unknown: unknown.length, findingCount: findings.length, classicWebhooks: classicWebhookSummary },
    scopes: { required: config.required, optional: config.optional },
    observations: observations.map(o => ({
      operation: o.operation,
      apiSurface: o.apiSurface ?? 'events',
      scope: o.requires.anyOf,
      file: path.relative(absoluteRoot, o.file).replaceAll(path.sep, '/'),
      line: o.line,
      ...(o.apiSurface === 'classic-webhook' ? { evidenceStatus: o.evidenceStatus, confidence: o.confidence, source: o.source, evidenceVersion: o.evidenceVersion } : {}),
    })),
    findings, unknown, skipped,
  };
}
