import fs from 'node:fs';
import path from 'node:path';
import TOML from '@iarna/toml';

export function parseConfig(file) {
  const source = fs.readFileSync(file, 'utf8');
  const data = TOML.parse(source);
  const scopes = String(data.access_scopes?.scopes ?? '').split(',').map(s => s.trim()).filter(Boolean);
  const optional = Array.isArray(data.access_scopes?.optional_scopes) ? data.access_scopes.optional_scopes.map(String) : [];
  const normalize = values => [...new Set(values.map(s => s.trim()).filter(Boolean))].sort();
  return { required: normalize(scopes), optional: normalize(optional), raw: { required: scopes, optional } };
}
