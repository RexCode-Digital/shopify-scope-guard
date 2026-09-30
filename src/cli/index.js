#!/usr/bin/env node
import process from 'node:process';
import { audit } from '../analyzer/index.js';
import { toHuman, toJson, toSarif } from '../output/index.js';
import { EVIDENCE_REGISTRY, EVIDENCE_VERSION } from '../evidence/registry.js';

const args = process.argv.slice(2); const command = args[0] ?? 'audit';
const value = (flag, fallback) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] ?? fallback : fallback; };
if (command === 'version' || args.includes('--version')) { console.log('0.1.0'); process.exit(0); }
if (command === 'rules') { console.log(JSON.stringify({ evidenceVersion: EVIDENCE_VERSION, rules: EVIDENCE_REGISTRY }, null, 2)); process.exit(0); }
if (command === 'explain') { const ruleId = args[1]; console.log(JSON.stringify(EVIDENCE_REGISTRY.filter(r => r.ruleId === ruleId), null, 2)); process.exit(0); }
if (command !== 'audit') { console.error('Usage: shopify-scope-guard audit [path] [--format human|json|sarif] [--fail-on none|low|medium|high]'); process.exit(2); }
try {
  const positional = args[1] && !args[1].startsWith('--') ? args[1] : '.';
  const report = audit({ root: value('--path', positional), configPath: value('--config'), include: value('--include'), exclude: args.includes('--include-fixtures') ? [] : undefined });
  const format = value('--format', 'human'); console.log(format === 'json' ? toJson(report) : format === 'sarif' ? toSarif(report) : toHuman(report));
  const threshold = value('--fail-on', 'none'); const failed = threshold !== 'none' && report.findings.some(f => ({ low: 1, medium: 2, high: 3 }[f.severity] ?? 0) >= ({ low: 1, medium: 2, high: 3 }[threshold] ?? 99)); process.exit(failed ? 1 : 0);
} catch (error) { console.error(`Scanner error: ${error.message}`); process.exit(2); }
