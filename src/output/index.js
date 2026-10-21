const rank = { info: 0, low: 1, medium: 2, high: 3 };
export function toJson(report) { return JSON.stringify(report, null, 2) + '\n'; }
export function toHuman(report, { showUnmapped = false } = {}) {
  const lines = ['Shopify Scope Guard', '', 'Scope audit', '────────────'];
  if (report.apiVersion) lines.push(`Admin GraphQL target: ${report.apiVersion.selected} (${report.apiVersion.status}); bundled evidence: ${report.apiVersion.evidenceVersion} (${report.apiVersion.evidenceApplicable ? 'applicable' : 'not applicable'})`);
  if (report.summary.classicWebhooks) {
    lines.push(`Classic webhooks: EVIDENCED ${report.summary.classicWebhooks.evidenced}, NOT EVIDENCED ${report.summary.classicWebhooks.notEvidenced}, UNKNOWN ${report.summary.classicWebhooks.unknown}`);
    for (const observation of (report.observations ?? []).filter(item => item.apiSurface === 'classic-webhook')) lines.push(`  ${observation.evidenceStatus} ${observation.operation} — requires one of ${observation.scope.join(', ')} (${observation.confidence} confidence)`);
  }
  lines.push(`Declared: required ${report.summary.declaredRequired}, optional ${report.summary.declaredOptional}`, `Observed: evidenced ${report.summary.evidenced}, unknown ${report.summary.unknown}`, `Findings: ${report.summary.findingCount}`, '');
  for (const f of [...report.findings].sort((a,b) => rank[b.severity]-rank[a.severity])) { lines.push(`${f.severity.toUpperCase()} ${f.ruleId}${f.scope ? ` — ${f.scope}` : ''}`, `  ${f.explanation}`, `  Evidence: ${f.evidence}`, `  Source: ${f.source}`, `  Location: ${f.file ?? 'repository'}${f.line ? `:${f.line}` : ''}`, `  Recommendation: ${f.remediation}`, ''); }
  if (showUnmapped) for (const item of report.unknown) lines.push(`UNKNOWN ${item.file}${item.line ? ':'+item.line : ''}: ${item.reason}`);
  if (report.skipped?.length) lines.push(`Skipped analysis: ${report.skipped.length} file(s); inspect JSON and review manually.`);
  return lines.join('\n');
}
export function toSarif(report) {
  const classicWebhooks = report.summary.classicWebhooks ?? { evidenced: 0, notEvidenced: 0, unknown: 0 };
  const classicWebhookObservations = (report.observations ?? []).filter(item => item.apiSurface === 'classic-webhook');
  return JSON.stringify({
    version: '2.1.0',
    $schema: 'https://json.schemastore.org/sarif-2.1.0.json',
    runs: [{
      tool: { driver: {
        name: report.tool.name,
        version: report.tool.version,
        informationUri: 'https://github.com/RexCode-Digital/shopify-scope-guard',
        rules: [...new Map(report.findings.map(f => [f.ruleId, { id: f.ruleId, shortDescription: { text: f.explanation }, helpUri: f.source }])).values()],
      } },
      properties: { apiVersion: report.apiVersion, classicWebhooks, classicWebhookObservations },
      results: report.findings.map(f => ({
        ruleId: f.ruleId,
        level: f.severity === 'high' ? 'error' : f.severity === 'medium' ? 'warning' : 'note',
        message: { text: f.explanation },
        properties: { remediation: f.remediation, confidence: f.confidence, evidence: f.evidence, source: f.source },
        locations: f.file ? [{ physicalLocation: {
          artifactLocation: { uri: f.file.split('/').map(encodeURIComponent).join('/') },
          region: f.line ? { startLine: f.line } : undefined,
        } }] : undefined,
      })),
    }],
  }, null, 2) + '\n';
}
