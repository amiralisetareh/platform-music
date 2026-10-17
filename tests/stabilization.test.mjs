import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import '../artwork-fallback.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = name => readFileSync(resolve(root, name), 'utf8');
const app = read('app.js');
const html = read('index.html');
const css = read('styles.css');
const artwork = globalThis.STARMUSICS_ArtworkFallback;

test('CSS background artwork fallback recognizes remote URLs and ignores self-contained data artwork', () => {
  assert.equal(artwork.backgroundUrl('url("https://images.example.test/cover.jpg")'), 'https://images.example.test/cover.jpg');
  assert.equal(artwork.backgroundUrl("linear-gradient(90deg, #fff, #eee), url('https://images.example.test/a.png')"), 'https://images.example.test/a.png');
  assert.equal(artwork.backgroundUrl(`url("${artwork.toDataUri('Album')}")`), '');
  assert.match(read('artwork-fallback.js'), /probe\.onerror/);
  assert.match(read('artwork-fallback.js'), /attributeFilter: \['src', 'style'\]/);
  assert.match(css, /\.artwork-fallback \{ background-color/);
});

test('curated cards and albums open details instead of pretending to be playable tracks', () => {
  assert.match(app, /curated-playlist-card/);
  assert.match(app, /data-open-curated-playlist="\$\{title\}"/);
  assert.match(app, /album-release-card/);
  assert.match(app, /verified tracklist pending/);
  assert.match(app, /openEntity\('playlist', 'Persian Trap'\)/);
  assert.doesNotMatch(app, /playTrack\(\{ title: 'Persian Trap Mix'/);
  assert.match(html, /Find your next sound/);
  assert.match(html, /data-go-view="explore"/);
});

test('saving and removing albums is represented in local and account library state', () => {
  assert.match(html, /id="btn-save-entity-album"/);
  assert.match(html, /id="library-saved-albums-section"/);
  assert.match(html, /id="library-saved-albums-row"/);
  assert.match(app, /savedAlbumIds: \[\.\.\.savedAlbumIds\]/);
  assert.match(app, /saveLocal\('starmusics\.savedAlbums'/);
  assert.match(app, /data-unsave-album/);
  assert.match(app, /function renderSavedAlbums\(/);
});

test('first-listen achievement requires an actual audio play event', () => {
  assert.match(app, /hasPlayedAudio: loadLocal\('starmusics\.hasPlayedAudio', false\) === true/);
  assert.match(app, /audioEngine\?\.addEventListener\('play',[\s\S]*state\.hasPlayedAudio = true/);
  assert.match(app, /earned:state\.hasPlayedAudio===true/);
  assert.doesNotMatch(app, /title:'First listen',[^\n]*earned:!!state\.current/);
});

test('dynamic content receives the currently selected interface language', () => {
  assert.match(app, /function installLanguageObserver\(/);
  assert.match(app, /languageObserver\.observe\(document\.body, \{ childList: true, subtree: true \}\)/);
  assert.match(app, /document\.documentElement\.dir=lang==='fa'\?'rtl':'ltr'/);
});

test('frontend API config loads before application code and local .env is loaded by the API script', () => {
  assert.ok(html.indexOf('src="config.js"') < html.indexOf('src="app.js"'));
  assert.ok(existsSync(resolve(root, 'config.js')));
  assert.match(read('config.js'), /const API_BASE_OVERRIDE = ''/);
  assert.ok(existsSync(resolve(root, 'scripts/start-api.mjs')));
  assert.match(read('package.json'), /"start:api": "node scripts\/start-api\.mjs"/);
  assert.match(read('scripts/start-api.mjs'), /await loadLocalEnv\(\);\s*await import\('\.\.\/server\/start\.mjs'\)/);
});
