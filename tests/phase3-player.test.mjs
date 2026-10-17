import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname);
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
const js = readFileSync(resolve(root, 'app.js'), 'utf8');
const css = readFileSync(resolve(root, 'design/phase-3-listening-experience.css'), 'utf8');
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));

test('v0.8.6 links the Phase 3 listening design layer and keeps the light glass palette', () => {
  assert.match(pkg.version, /^(0\.8\.[6-9]|0\.9\.0)$/);
  assert.match(html, /href="design\/phase-3-listening-experience\.css"/);
  assert.match(css, /white\/off-white clear-glass visual language/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /prefers-reduced-transparency/);
});

test('queue supports clear, reorder, remove, empty state, and track selection', () => {
  assert.match(html, /id="btn-clear-queue"/);
  assert.match(html, /id="queue-summary"/);
  assert.match(js, /data-queue-move="up"/);
  assert.match(js, /data-queue-move="down"/);
  assert.match(js, /data-queue-remove="\$\{index\}"/);
  assert.match(js, /data-queue-play="\$\{index\}"/);
  assert.match(js, /Your queue is empty/);
  assert.match(js, /state\.queue = state\.queue\.slice\(index \+ 1\)/);
  assert.match(js, /Queue cleared/);
});

test('expanded player exposes semantic dialog behavior and focus management', () => {
  assert.match(html, /id="now-playing-modal" role="dialog" aria-modal="true" aria-labelledby="np-title"/);
  assert.match(js, /state\.playerFocusReturn = document\.activeElement/);
  assert.match(js, /Keep keyboard focus inside the expanded player/);
  assert.match(js, /setPlayerMode\('dock'\)/);
});

test('OS media controls are progressive enhancement and do not require bundled music', () => {
  assert.match(js, /function initializeMediaSession\(\)/);
  assert.match(js, /navigator\.mediaSession\.setActionHandler/);
  assert.match(js, /function syncMediaSession\(track, audio\)/);
  assert.match(js, /seekto: details/);
  assert.match(js, /Unsupported media action on this browser/);
});

test('share cards offer three saved visual themes and never claim demo lyrics are licensed', () => {
  assert.match(html, /id="lyrics-card-theme"/);
  for (const theme of ['glass', 'afterglow', 'paper']) assert.match(html, new RegExp(`value="${theme}"`));
  assert.match(html, /Export track card/);
  assert.match(js, /function exportTrackCard\(\)/);
  assert.match(js, /await navigator\.share/);
  assert.match(js, /TRACK CARD · LYRICS NOT INCLUDED/);
  assert.match(js, /Lyrics were not included/);
});
