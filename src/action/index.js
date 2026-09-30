import fs from 'node:fs';
import process from 'node:process';
import { audit } from '../analyzer/index.js';
import { toHuman, toJson, toSarif } from '../output/index.js';

const input = name => process.env[`INPUT_${name.toUpperCase().replaceAll('-', '_')}`] || '';
const report = audit({ root: input('path') || '.', configPath: input('config') || undefined });
const format = input('format') || 'human';
const rendered = format === 'json' ? toJson(report) : format === 'sarif' ? toSarif(report) : toHuman(report);
console.log(rendered);
if (format === 'sarif') fs.writeFileSync('scope-guard.sarif', rendered);
const counts = severity => report.findings.filter(f => f.severity === severity).length;
const missing = report.findings.filter(f => f.ruleId === 'SG-SCOPE-001' || f.ruleId === 'SG-SCOPE-002').length;
const redundant = report.findings.filter(f => f.ruleId === 'SG-SCOPE-003').length;
const values = { outcome: counts('high') ? 'failed' : 'passed', 'finding-count': report.findings.length, 'high-count': counts('high'), 'medium-count': counts('medium'), 'low-count': counts('low'), 'unknown-count': report.summary.unknown, 'missing-scope-count': missing, 'redundant-scope-count': redundant, report: format === 'sarif' ? 'scope-guard.sarif' : '' };
if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, Object.entries(values).map(([key, value]) => `${key}=${value}`).join('\n') + '\n');
const threshold = input('fail-on') || 'high';
const order = { none: 0, low: 1, medium: 2, high: 3 };
if (order[threshold] > 0 && report.findings.some(f => order[f.severity] >= order[threshold])) process.exit(1);
