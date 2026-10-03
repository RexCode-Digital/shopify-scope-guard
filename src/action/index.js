import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { audit } from '../analyzer/index.js';
import { toHuman, toJson, toSarif } from '../output/index.js';
import { shouldFail, validateOptions } from '../policy.js';
const input = name => process.env[`INPUT_${name.toUpperCase().replaceAll('-', '_')}`] || '';
try {
  const format = input('format') || 'human', threshold = input('fail-on') || 'high';
  validateOptions({ format, failOn: threshold });
  if (input('show-unmapped') && !['true','false'].includes(input('show-unmapped'))) throw new Error('show-unmapped must be true or false');
  const report = audit({ root: input('path') || '.', configPath: input('config') || undefined });
  const rendered = format === 'json' ? toJson(report) : format === 'sarif' ? toSarif(report) : toHuman(report, { showUnmapped: input('show-unmapped') === 'true' });
  const stop = randomUUID(); console.log(`::stop-commands::${stop}\n${rendered}\n::${stop}::`);
  const directory = process.env.RUNNER_TEMP || process.cwd();
  const reportPath = path.join(directory, `scope-guard-${randomUUID()}.json`);
  fs.writeFileSync(reportPath, toJson(report));
  if (format === 'sarif') fs.writeFileSync(path.join(directory, 'scope-guard.sarif'), rendered);
  const counts = severity => report.findings.filter(f => f.severity === severity).length;
  const failed = shouldFail(report, threshold);
  const values = { outcome: failed ? 'failed' : 'passed', 'finding-count': report.findings.length, 'high-count': counts('high'), 'medium-count': counts('medium'), 'low-count': counts('low'), 'unknown-count': report.summary.unknown, 'missing-scope-count': report.findings.filter(f => ['SG-SCOPE-001','SG-SCOPE-002'].includes(f.ruleId)).length, 'redundant-scope-count': report.findings.filter(f => f.ruleId === 'SG-SCOPE-003').length, report: reportPath };
  if (process.env.GITHUB_OUTPUT) for (const [key,value] of Object.entries(values)) { const delimiter = randomUUID(); fs.appendFileSync(process.env.GITHUB_OUTPUT, `${key}<<${delimiter}\n${value}\n${delimiter}\n`); }
  process.exitCode = failed ? 1 : 0;
} catch (error) { console.error(`Scope Guard scanner error: ${String(error.message).replace(/[\r\n]/g, ' ')}`); process.exitCode = 2; }
