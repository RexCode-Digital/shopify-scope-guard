import fs from 'node:fs';
import path from 'node:path';
import TOML from '@iarna/toml';

export function regularFile(root, file) {
  const relative = path.relative(root, file);
  if (relative.startsWith(`..${path.sep}`) || relative === '..' || path.isAbsolute(relative)) throw new Error('Configuration must be inside the scan root');
  let current = root;
  for (const part of relative.split(path.sep)) {
    current = path.join(current, part);
    if (fs.lstatSync(current).isSymbolicLink()) throw new Error('Symbolic links are not supported configuration inputs');
  }
  const stat = fs.lstatSync(file);
  if (!stat.isFile() || stat.size > 1024 * 1024) throw new Error('Configuration must be a regular file up to 1 MiB');
}
export function parseConfig(file) {
  const stat = fs.lstatSync(file);
  if (!stat.isFile() || stat.size > 1024 * 1024) throw new Error('Configuration must be a regular file up to 1 MiB');
  let data;
  try { data = TOML.parse(fs.readFileSync(file, 'utf8')); } catch { throw new Error('Invalid Shopify app TOML; contents were not printed'); }
  const section = data.access_scopes;
  if (!section || typeof section.scopes !== 'string') throw new Error('[access_scopes].scopes must be a comma-separated string');
  if (section.optional_scopes !== undefined && (!Array.isArray(section.optional_scopes) || section.optional_scopes.some(s => typeof s !== 'string' || !s.trim()))) throw new Error('[access_scopes].optional_scopes must be an array of non-empty strings');
  const scopes = section.scopes.split(',').map(s => s.trim()).filter(Boolean);
  const optional = section.optional_scopes ?? [];
  const normalize = values => [...new Set(values.map(s => s.trim()).filter(Boolean))].sort();
  const required = normalize(scopes), normalizedOptional = normalize(optional);
  if (required.some(s => normalizedOptional.includes(s))) throw new Error('A scope cannot be both required and optional');
  return { required, optional: normalizedOptional, raw: { required: scopes, optional }, events: data.events ?? null };
}
