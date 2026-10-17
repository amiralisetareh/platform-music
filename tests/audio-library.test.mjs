import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

test('audio library manifest is explicit-rights-first and starts empty', async () => {
  const manifest = JSON.parse(await readFile(new URL('../data/audio-library.json', import.meta.url), 'utf8'));
  assert.equal(manifest.schemaVersion, 1);
  assert.equal(manifest.policy, 'explicit-distribution-rights-required');
  assert.deepEqual(manifest.assets, []);
});

test('audio audit accepts the empty manifest without enabling playback', () => {
  const result = spawnSync(process.execPath, ['scripts/audit-audio-library.mjs'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Manifest assets: 0/);
  assert.match(result.stdout, /no audio is approved/);
});

test('manifest audit rejects traversal paths and missing evidence', async () => {
  const script = await readFile(new URL('../scripts/audit-audio-library.mjs', import.meta.url), 'utf8');
  assert.match(script, /escapes the audio library/);
  assert.match(script, /evidenceRef/);
  assert.match(script, /does not exist/);
});
