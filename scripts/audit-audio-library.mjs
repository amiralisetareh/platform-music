import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.join(root, 'data/audio-library.json');
const errors = [];
let manifest;
try { manifest = JSON.parse(await readFile(manifestPath, 'utf8')); }
catch (error) { console.error(`Cannot read data/audio-library.json: ${error.message}`); process.exit(1); }
const allowedMime = new Set(['audio/mpeg','audio/mp4','audio/aac','audio/ogg','audio/opus','audio/wav','audio/flac','audio/webm']);
const ids = new Set();
if (manifest.schemaVersion !== 1 || manifest.policy !== 'explicit-distribution-rights-required' || !Array.isArray(manifest.assets)) errors.push('Manifest must use schemaVersion 1, the explicit-rights policy, and an assets array.');
for (const [index, asset] of (manifest.assets || []).entries()) {
  const at = `assets[${index}]`;
  if (!asset || typeof asset !== 'object') { errors.push(`${at} must be an object.`); continue; }
  for (const field of ['trackId','path','mimeType','rightsHolder','evidenceRef','verifiedAt']) if (typeof asset[field] !== 'string' || !asset[field].trim()) errors.push(`${at}.${field} is required.`);
  if (ids.has(asset.trackId)) errors.push(`${at}.trackId duplicates ${asset.trackId}.`);
  ids.add(asset.trackId);
  if (!/^track-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(asset.trackId || '')) errors.push(`${at}.trackId must be a canonical track ID.`);
  if (!allowedMime.has(asset.mimeType)) errors.push(`${at}.mimeType is not an approved audio MIME type.`);
  if (!Array.isArray(asset.territories) || !asset.territories.length || asset.territories.some(t => t !== '*' && !/^[A-Z]{2}$/.test(t))) errors.push(`${at}.territories must contain ISO alpha-2 codes or *.`);
  if (!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{1,3})?(?:Z|[+-]\d\d:\d\d)$/.test(asset.verifiedAt || '') || !Number.isFinite(Date.parse(asset.verifiedAt))) errors.push(`${at}.verifiedAt must be a valid ISO-8601 timestamp with timezone.`);
  if (typeof asset.path !== 'string' || asset.path.includes('\\') || asset.path.startsWith('/') || asset.path.split('/').some(part => !part || part === '.' || part === '..') || !/^[-a-zA-Z0-9_./]+$/.test(asset.path || '')) {
    errors.push(`${at}.path must be a safe relative path under public/media/audio.`);
  } else {
    const fullPath = path.resolve(root, 'public/media/audio', asset.path);
    const allowedRoot = path.resolve(root, 'public/media/audio') + path.sep;
    if (!fullPath.startsWith(allowedRoot)) errors.push(`${at}.path escapes the audio library.`);
    else {
      try { const info = await stat(fullPath); if (!info.isFile() || info.size === 0) errors.push(`${at}.path must reference a non-empty file.`); }
      catch { errors.push(`${at}.path file does not exist: ${asset.path}`); }
    }
  }
}
console.log('STARMUSICS rights-cleared audio audit');
console.log(`Manifest assets: ${(manifest.assets || []).length}`);
console.log('Policy: explicit distribution rights required; no automatic playback activation');
if (errors.length) { console.error(`Errors: ${errors.length}`); for (const error of errors) console.error(`- ${error}`); process.exit(1); }
console.log('Manifest valid. An empty manifest is valid and means no audio is approved for this release.');
