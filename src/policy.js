const rank = { info: 0, low: 1, medium: 2, high: 3 };
export function validateOptions({ format = 'human', failOn = 'none' } = {}) {
  if (!['human', 'json', 'sarif'].includes(format)) throw new Error('format must be human, json, or sarif');
  if (!['none', 'low', 'medium', 'high'].includes(failOn)) throw new Error('fail-on must be none, low, medium, or high');
}
export function shouldFail(report, threshold = 'none') {
  validateOptions({ failOn: threshold });
  return threshold !== 'none' && report.findings.some(f => rank[f.severity] >= rank[threshold]);
}
