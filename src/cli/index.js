#!/usr/bin/env node
import { TOOL_VERSION } from '../version.js';
import { audit } from '../analyzer/index.js';
import { toHuman, toJson, toSarif } from '../output/index.js';
import { EVIDENCE_REGISTRY, EVIDENCE_VERSION } from '../evidence/registry.js';
import { shouldFail, validateOptions } from '../policy.js';
const args = process.argv.slice(2);
const help = 'Usage: shopify-scope-guard audit [path] [--path DIR] [--config FILE] [--include TEXT] [--format human|json|sarif] [--fail-on none|low|medium|high] [--show-unmapped]\n       shopify-scope-guard rules|explain RULE|--version';
if (args.includes('--help') || args.includes('-h')) { console.log(help); process.exit(0); }
if (args.includes('--version') || args[0] === 'version') { console.log(TOOL_VERSION); process.exit(0); }
const command = args[0] && !args[0].startsWith('-') ? args.shift() : 'audit';
try {
  if (command === 'rules') { console.log(JSON.stringify({ evidenceVersion: EVIDENCE_VERSION, rules: EVIDENCE_REGISTRY }, null, 2)); process.exit(0); }
  if (command === 'explain') { const rules = EVIDENCE_REGISTRY.filter(r => r.ruleId === args[0]); if (!rules.length) throw new Error('Unknown rule ID'); console.log(JSON.stringify(rules, null, 2)); process.exit(0); }
  if (command !== 'audit') throw new Error(help);
  const options = {}; let positional;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--show-unmapped') { options.showUnmapped = true; continue; }
    if (['--path', '--config', '--include', '--format', '--fail-on'].includes(arg)) {
      if (!args[i + 1] || args[i + 1].startsWith('-')) throw new Error(`Missing value for ${arg}`);
      options[arg.slice(2)] = args[++i];
    } else if (!arg.startsWith('-') && positional === undefined) positional = arg;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  const format = options.format ?? 'human', threshold = options['fail-on'] ?? 'none';
  validateOptions({ format, failOn: threshold });
  const report = audit({ root: options.path ?? positional ?? '.', configPath: options.config, include: options.include });
  console.log(format === 'json' ? toJson(report) : format === 'sarif' ? toSarif(report) : toHuman(report, { showUnmapped: options.showUnmapped }));
  process.exitCode = shouldFail(report, threshold) ? 1 : 0;
} catch (error) { console.error(`Scanner error: ${error.message}`); process.exitCode = 2; }
