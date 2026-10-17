import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// Load the optional local .env before importing the API, because the API reads
// its storage and origin configuration during module initialization.
async function loadLocalEnv() {
  let contents;
  try { contents = await readFile(resolve(process.cwd(), '.env'), 'utf8'); }
  catch (error) { if (error.code === 'ENOENT') return; throw error; }

  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const normalized = line.startsWith('export ') ? line.slice(7).trim() : line;
    const match = normalized.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (Object.prototype.hasOwnProperty.call(process.env, key)) continue;
    let value = rawValue.trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    else value = value.replace(/\s+#.*$/, '').trim();
    process.env[key] = value;
  }
}

await loadLocalEnv();
await import('../server/start.mjs');
