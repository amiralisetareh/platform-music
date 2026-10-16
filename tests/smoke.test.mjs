import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
const js = readFileSync(resolve(root, 'app.js'), 'utf8');
const css = readFileSync(resolve(root, 'styles.css'), 'utf8');

test('application JavaScript parses successfully', () => {
  const result = spawnSync(process.execPath, ['--check', resolve(root, 'app.js')], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});

test('HTML has unique IDs and its local assets exist', () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'HTML contains duplicate IDs');
  assert.match(html, /src="app\.js"/);
  assert.match(html, /href="styles\.css"/);
  assert.match(html, /id="music-player"[^>]*hidden/);
});

test('core views and profile editing controls are present', () => {
  for (const view of ['home', 'explore', 'library', 'playlists', 'artists', 'albums', 'genres', 'discussions', 'profile']) {
    assert.match(html, new RegExp(`id="view-${view}"`), `missing ${view} view`);
  }
  assert.match(html, /id="profile-display-name"/);
  assert.match(html, /id="profile-bio"/);
  assert.match(js, /function updateProfileCount\(/);
});

test('discussion and liked-track regressions are covered by implementation hooks', () => {
  assert.match(js, /function discussionCount\(/);
  assert.match(html, /id="discussion-thread-title"/);
  assert.match(js, /function resolveTrack\(/);
  assert.match(js, /function likedTrackItems\(/);
  assert.match(js, /renderDiscussionPage\(\); renderDiscussions\(\); renderHomeDiscussions\(\)/);
});

test('mobile navigation and light glass styling remain available', () => {
  assert.equal((html.match(/class="mobile-nav-item/g) || []).length, 5);
  assert.doesNotMatch(html, /class="nav-item active?[^"]*" data-view="library"/);
  assert.doesNotMatch(html, /class="nav-item active?[^"]*" data-view="playlists"/);
  assert.doesNotMatch(html, /class="nav-item[^"]*" data-view="profile"/);
  assert.doesNotMatch(html, /class="mobile-nav-item[^"]*" data-view="profile"/);
  assert.match(html, /class="profile-library-icon"[^>]*data-profile-shortcut="liked"/);
  assert.match(html, /id="profile-playlists"/);
  assert.match(css, /\.mobile-nav/);
  assert.match(css, /backdrop-filter/);
  assert.doesNotMatch(html, /id="theme-toggle"/);
});

test('playlist builder supports detail, add/remove, and ordered playback hooks', () => {
  assert.match(html, /id="playlist-detail-section"/);
  assert.match(html, /id="playlist-track-list"/);
  assert.match(html, /id="playlist-add-track-list"/);
  assert.match(html, /id="btn-play-playlist"/);
  assert.match(js, /function renderPlaylistDetail\(/);
  assert.match(js, /data-add-playlist-track/);
  assert.match(js, /data-remove-playlist-track/);
  assert.match(js, /state\.queue=pl\.tracks\.slice\(1\)/);
  assert.match(js, /function savePlaylists\(/);
});

test('cinematic player supports three modes and uses a real audio element', () => {
  assert.match(html, /id="audio-engine"/);
  assert.match(html, /id="audio-file-input"/);
  assert.match(html, /data-player-mode="dock"/);
  assert.match(html, /data-player-mode="page"/);
  assert.match(html, /data-player-mode="mini"/);
  assert.match(html, /id="btn-lyrics"/);
  assert.match(js, /function setPlayerMode\(mode\)/);
  assert.match(js, /audio\.play\(\)/);
  assert.match(js, /audioEngine\?\.addEventListener\('timeupdate'/);
  assert.match(css, /\.player-mini/);
  assert.match(html, /id="btn-mini-restore"/);
  assert.match(html, /id="btn-mini-expand"/);
  assert.match(js, /playerModeBeforeMini/);
  assert.match(js, /setPlayerMode\(state\.playerModeBeforeMini \|\| 'dock'\)/);
  assert.match(css, /@keyframes ambient-drift/);
  assert.match(css, /@keyframes visualizer-dance/);
  assert.match(css, /prefers-reduced-motion/);
});

test('language menu includes English, Russian and Persian with RTL support hook', () => {
  assert.match(html, /id="btn-language"/);
  assert.match(html, /data-language="en"/);
  assert.match(html, /data-language="ru"/);
  assert.match(html, /data-language="fa"/);
  assert.match(js, /document\.documentElement\.dir=lang==='fa'\?'rtl':'ltr'/);
  assert.match(js, /starmusics\.language/);
  assert.match(js, /languageMenu\?\.addEventListener\('click'/);
  assert.match(html, /class="las la-globe"/);
  assert.match(html, /icons8\.com|Icons by Icons8/);
  assert.match(html, /line-awesome/);
});

test('artist, album and genre discovery detail sheets are wired', () => {
  assert.match(html, /id="entity-detail"/);
  assert.match(html, /id="entity-track-list"/);
  assert.match(js, /function openEntity\(kind,name\)/);
  assert.match(js, /data-open-artist/);
  assert.match(js, /data-open-genre/);
  assert.match(js, /data-open-album/);
});


test('mobile retains working language and player-mode controls', () => {
  assert.match(css, /language-trigger/);
  assert.match(html, /class="las la-/);
  assert.ok(css.includes('.player:not(.player-mini) #btn-player-mode { display:grid !important;'));
});
