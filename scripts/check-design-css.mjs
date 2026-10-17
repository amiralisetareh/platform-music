import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const files = [
  resolve(root, 'styles.css'),
  resolve(root, 'design/phase-1-home-navigation.css'),
  resolve(root, 'design/phase-2-search-entity.css'),
  resolve(root, 'design/phase-3-listening-experience.css'),
  resolve(root, 'design/phase-4-community-profile.css'),
  resolve(root, 'design/phase-5-community-backend.css'),
];

function validateCss(path) {
  const source = readFileSync(path, 'utf8');
  let depth = 0;
  let quote = null;
  let escaped = false;
  let comment = false;
  for (let i = 0; i < source.length; i += 1) {
    const char = source[i];
    const next = source[i + 1];
    if (comment) {
      if (char === '*' && next === '/') { comment = false; i += 1; }
      continue;
    }
    if (quote) {
      if (escaped) { escaped = false; continue; }
      if (char === '\\') { escaped = true; continue; }
      if (char === quote) quote = null;
      continue;
    }
    if (char === '/' && next === '*') { comment = true; i += 1; continue; }
    if (char === '"' || char === "'") { quote = char; continue; }
    if (char === '{') depth += 1;
    if (char === '}') {
      depth -= 1;
      if (depth < 0) throw new Error(`${path}: unexpected closing brace at offset ${i}`);
    }
  }
  if (comment) throw new Error(`${path}: unterminated comment`);
  if (quote) throw new Error(`${path}: unterminated string`);
  if (depth !== 0) throw new Error(`${path}: unbalanced braces (${depth} remaining)`);
  return source.length;
}

for (const path of files) {
  const length = validateCss(path);
  process.stdout.write(`CSS structure OK: ${path.slice(root.length + 1)} (${length} chars)\n`);
}
