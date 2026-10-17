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
const designTokens = readFileSync(resolve(root, 'design/tokens.css'), 'utf8');

test('application JavaScript parses successfully', () => {
  const result = spawnSync(process.execPath, ['--check', resolve(root, 'app.js')], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});

test('HTML has unique IDs and its local assets exist', () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'HTML contains duplicate IDs');
  assert.match(html, /src="app\.js"/);
  assert.match(html, /href="styles\.css"/);
  assert.match(html, /href="design\/phase-1-home-navigation\.css"/);
  assert.match(html, /href="design\/phase-2-search-entity\.css"/);
  assert.ok(readFileSync(resolve(root, 'design/phase-1-home-navigation.css'), 'utf8').length > 1000);
  assert.ok(readFileSync(resolve(root, 'design/phase-2-search-entity.css'), 'utf8').length > 1000);
  assert.match(html, /src="catalog-data\.js"/);
  assert.match(html, /src="catalog-service\.js"/);
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
  assert.match(html, /class="nav-item" data-view="library"/);
  assert.match(html, /class="nav-item" data-view="playlists"/);
  assert.match(html, /class="mobile-nav-item" type="button" data-view="library"/);
  assert.match(html, /class="mobile-nav-item" type="button" data-view="playlists"/);
  assert.match(html, /data-view="about"/);
  assert.match(html, /About us/);
  assert.match(html, /id="view-about"/);
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
  assert.match(html, /class="toolbar-icon-svg" viewBox="0 0 24 24"/);
  assert.match(html, /icons8\.com|Icons by Icons8/);
  assert.match(html, /line-awesome/);
});

test('artist, album and genre discovery detail sheets are wired', () => {
  assert.match(html, /id="entity-detail"/);
  assert.match(html, /id="entity-track-list"/);
  assert.match(js, /function openEntity\(kind,name,options=\{\}\)/);
  assert.match(js, /data-open-artist/);
  assert.match(js, /data-open-genre/);
  assert.match(js, /data-open-album/);
});


test('mobile retains working language and player-mode controls', () => {
  assert.match(css, /language-trigger/);
  assert.match(html, /class="nav-icon-svg"/);
  assert.match(html, /class="player-icon"/);
  assert.ok(css.includes('.player:not(.player-mini) #btn-player-mode { display:grid !important;'));
});


test('clear-glass navigation exposes Discussions on desktop and mobile', () => {
  assert.match(html, /class="nav-item[^"]*" data-view="discussions"/);
  assert.match(html, /class="mobile-nav-item[^"]*"[^>]*data-view="discussions"/);
  assert.match(designTokens, /--glass-bg: var\(--sm-surface-glass\)/);
  assert.match(designTokens, /--sm-surface-glass: linear-gradient\(145deg, rgba\(255,255,255,\.58\)/);
  assert.match(css, /backdrop-filter: blur\(26px\) saturate\(175%\)/);
  assert.match(css, /STARMUSICS PHASE 1 — Clear Apple-glass foundation/);
});

test('phase 2 navigation has secondary About placement and accessible active states', () => {
  assert.match(html, /class="nav-main" aria-label="Main navigation"/);
  assert.match(html, /class="nav-secondary" aria-label="Secondary navigation"/);
  assert.match(html, /data-view="about"/);
  assert.match(css, /\.nav-item\.active::before/);
  assert.match(css, /\.nav-item\[title\]:hover::after/);
  assert.match(js, /setAttribute\('aria-current', 'page'\)/);
});

test('phase 3 makes search the primary discovery experience with quick queries and full results', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const js = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
  assert.match(html, /id="discovery-search-input"/);
  assert.match(html, /data-discovery-query="Kendrick Lamar"/);
  assert.match(html, /id="discovery-results"/);
  assert.match(html, /id="discovery-filter-bar"/);
  assert.match(html, /data-search-filter="track"/);
  assert.match(html, /data-search-filter="artist"/);
  assert.match(html, /data-search-filter="album"/);
  assert.match(html, /data-search-filter="playlist"/);
  assert.match(html, /data-search-filter="genre"/);
  assert.match(html, /id="discovery-playlists-row"/);
  assert.match(js, /discoveryInput\?\.addEventListener\('input'/);
  assert.match(js, /Catalog\.search\(query\)/);
  assert.match(readFileSync(resolve(root, 'catalog-service.js'), 'utf8'), /type: 'Album'/);
  assert.match(readFileSync(resolve(root, 'catalog-service.js'), 'utf8'), /types\.includes\('genres'\)/);
  assert.match(js, /data-open-curated-playlist/);
  assert.match(js, /data-open-personal-playlist/);
  assert.match(js, /activeSearchFilter/);
  assert.match(js, /const SEARCH_COPY/);
  assert.match(js, /filteredCount:/);
  assert.match(html, /aria-label="Main navigation"/);
  assert.match(css, /\.discovery-hero/);
  assert.match(css, /\.discovery-results/);
});

test('phase 2+3 refinement keeps navigation in a rail and routes global Enter search into Explore', () => {
  assert.match(html, /class="sidebar"/);
  assert.match(html, /class="nav-main"/);
  assert.match(html, /class="nav-item[^\"]*" data-view="discussions"/);
  assert.match(js, /searchInput\?\.addEventListener\('keydown'/);
  assert.match(js, /switchView\('explore'\)/);
  assert.match(js, /discoveryInput\?\.focus\(\)/);
  assert.match(css, /PHASE 2 \+ 3 REFINEMENT/);
  assert.match(css, /\.discovery-search:focus-within/);
});


test('search results have working type-specific destinations and no unsupported lyrics promise', () => {
  assert.match(js, /openEntity\('album', searchItem\.dataset\.title\)/);
  assert.match(js, /openEntity\('playlist',openCuratedPlaylist\.dataset\.openCuratedPlaylist\)/);
  assert.match(js, /openPlaylist\(Number\(openPersonalPlaylist\.dataset\.openPersonalPlaylist\)\)/);
  assert.match(html, /Search tracks, artists, albums, playlists, or genres/);
  assert.doesNotMatch(html, /placeholder="Search artists, tracks, albums, lyrics/);
  assert.match(css, /\.discovery-filter\[aria-pressed="true"\]/);
});

test('phase 4 Home hierarchy prioritizes releases, curated playlists, artists, and compact discussions', () => {
  const homeStart = html.indexOf('id="view-home"');
  const exploreStart = html.indexOf('id="view-explore"');
  const homeHtml = html.slice(homeStart, exploreStart);
  assert.match(homeHtml, /class="featured"/);
  assert.match(homeHtml, /id="home-genre-heading">Start with a sound/);
  assert.ok(homeHtml.indexOf('id="releases-row"') < homeHtml.indexOf('id="playlists-row"'), 'New Releases should appear before Featured Playlists');
  assert.match(homeHtml, /id="artists-row"/);
  assert.match(homeHtml, /id="home-discussion-list"/);
  assert.match(js, /communityTopics\.slice\(0, 2\)/, 'Home should preview two active community topics rather than duplicating the full list');
  assert.match(css, /STARMUSICS PHASE 4 — Home curation and content hierarchy/);
  assert.match(css, /\.home-genre-chip:focus-visible/);
});

test('phase 4 removes Icons8 from the sidebar but retains attribution in About', () => {
  const sidebarStart = html.indexOf('<aside class="sidebar">');
  const mainStart = html.indexOf('<main class="main">');
  const sidebarHtml = html.slice(sidebarStart, mainStart);
  assert.doesNotMatch(sidebarHtml, /Icons8|icons8\.com|icons8-credit/i);
  assert.match(html, /Icons by <a href="https:\/\/icons8\.com"/);
  assert.doesNotMatch(css, /\.icons8-credit/);
});

test('phase 4 featured playlist save toggle persists and appears in Library', () => {
  assert.match(html, /id="btn-save-featured"[^>]*aria-pressed="false"/);
  assert.match(html, /id="library-saved-picks-section" hidden/);
  assert.match(html, /id="library-saved-picks-row"/);
  assert.match(js, /loadLocal\('starmusics\.savedFeatured', false\)/);
  assert.match(js, /saveLocal\('starmusics\.savedFeatured', featuredSaved\)/);
  assert.match(js, /function renderSavedFeatured\(/);
  assert.match(js, /function updateFeaturedSaveButton\(/);
  assert.match(css, /\.library-saved-picks\[hidden\]/);
});


test('phase 5 player controls stay synchronized and accessible in dock and full-player modes', () => {
  assert.match(html, /id="np-progress-bar"[^>]*role="slider"/);
  assert.match(html, /type="range"[^>]*id="np-volume-range"/);
  assert.match(html, /id="btn-np-queue"/);
  assert.match(js, /function setVolume\(value, persist = true\)/);
  assert.match(js, /audio\.volume = state\.volume \/ 100/);
  assert.match(js, /localStorage\.setItem\('starmusics\.volume'/);
  assert.match(js, /npProgress\.setAttribute\('aria-valuetext'/);
  assert.match(js, /function prevTrack\(\)/);
  assert.match(js, /previousTracks\.pop\(\)/);
  assert.match(js, /forwardTracks\.pop\(\)/);
  assert.match(js, /function setShuffle\(enabled\)/);
  assert.match(js, /state\.queueBeforeShuffle = state\.queue\.slice\(\)/);
  assert.match(js, /\$\('#btn-np-queue'\)/);
  assert.match(css, /\.np-page-mode \.np-player-tools/);
});

test('phase 5 fixes mobile navigation independently of remote icon fonts', () => {
  const navStart = html.indexOf('<nav class="mobile-nav"');
  const navEnd = html.indexOf('</nav>', navStart) + '</nav>'.length;
  const navHtml = html.slice(navStart, navEnd);
  assert.equal((navHtml.match(/class="mobile-nav-item/g) || []).length, 5);
  assert.equal((navHtml.match(/class="mobile-nav-icon-svg"/g) || []).length, 5);
  assert.doesNotMatch(navHtml, /class="las /);
  assert.match(navHtml, /aria-current="page"/);
  assert.match(css, /\.mobile-nav-icon-svg/);
  assert.match(css, /body\.has-active-player \.content/);
  assert.match(css, /env\(safe-area-inset-bottom\)/);
  assert.match(css, /\.queue-panel \{ z-index: 96/);
});

test('phase 5 queue rows are semantic controls and full-player queue is reachable', () => {
  assert.match(js, /<button type="button" class="q-item"/);
  assert.match(js, /aria-label="Play \$\{escapeHTML\(t\.track \|\| t\.title\)\} by/);
  assert.match(js, /\$\('#btn-np-queue'\)\?\.addEventListener/);
  assert.match(css, /\.q-item:focus-visible/);
  assert.match(css, /\.np-volume-control input/);
});


test('phase 5 player icons render from inline SVG instead of depending on the external icon font', () => {
  assert.match(js, /function playerIcon\(name\)/);
  assert.match(js, /muteButton\.innerHTML = playerIcon/);
  assert.match(js, /const playIcon = playerIcon\('play'\)/);
  const playerStart = html.indexOf('<footer class="player"');
  const playerEnd = html.indexOf('</footer>', playerStart) + '</footer>'.length;
  const playerHtml = html.slice(playerStart, playerEnd);
  assert.match(playerHtml, /<svg class="player-icon"/);
  assert.doesNotMatch(playerHtml, /class="las /);
});

test('phase 5 core navigation and toolbar icons are inline SVGs', () => {
  const sidebarStart = html.indexOf('<aside class="sidebar">');
  const sidebarEnd = html.indexOf('</aside>', sidebarStart) + '</aside>'.length;
  const sidebarHtml = html.slice(sidebarStart, sidebarEnd);
  assert.equal((sidebarHtml.match(/class="nav-icon-svg"/g) || []).length, 9);
  assert.doesNotMatch(sidebarHtml, /class="las /);
  assert.match(html, /class="toolbar-icon-svg" viewBox="0 0 24 24"/);
  assert.match(css, /\.nav-icon-svg/);
  assert.match(css, /\.toolbar-icon-svg/);
});


test('v0.8.4 Home and navigation design layer is linked and preserves light glass styling', () => {
  const designCss = readFileSync(resolve(root, 'design/phase-1-home-navigation.css'), 'utf8');
  assert.match(html, /href="design\/phase-1-home-navigation\.css"/);
  assert.match(html, /title="Discussions"/);
  assert.match(designCss, /#view-home \.featured/);
  assert.match(designCss, /\.mobile-nav-item\.active/);
  assert.match(designCss, /prefers-reduced-motion/);
  assert.match(designCss, /prefers-reduced-transparency/);
  assert.match(designCss, /dir=\"rtl\"/);
});

test('Phase 7 connects account registration, login, profile and library sync to the API', () => {
  assert.match(html, /id=\"account-dialog\"/);
  assert.match(html, /id=\"account-form\"/);
  assert.match(html, /id=\"btn-account-register\"/);
  assert.match(html, /id=\"btn-account-logout\"/);
  assert.match(html, /id=\"btn-account-retry-sync\"/);
  assert.match(js, /async function accountRequest\(/);
  assert.match(js, /async function initializeAccountSession\(/);
  assert.match(js, /async function persistAccountLibrary\(/);
  assert.match(js, /async function persistAccountProfile\(/);
  assert.match(js, /credentials: 'include'/);
  assert.match(js, /likedTracks:/);
  assert.match(css, /\.account-dialog/);
});

test('consolidated release loads the local artwork fallback before app rendering', () => {
  const fallbackPath = resolve(root, 'artwork-fallback.js');
  assert.match(html, /<script src="artwork-fallback\.js"><\/script>/);
  assert.ok(html.indexOf('artwork-fallback.js') < html.indexOf('app.js'), 'artwork fallback must initialize before the app');
  const result = spawnSync(process.execPath, ['--check', fallbackPath], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});


test('Phase 2 discovery layout has a semantic hero, search, and visual accent', () => {
  assert.match(html, /id="discovery-heading"/);
  assert.match(html, /class="discovery-search-wrap"/);
  assert.match(html, /class="discovery-hero-art"/);
  assert.match(html, /data-discovery-query="Persian Trap"/);
  const phaseCss = readFileSync(resolve(root, 'design/phase-2-search-entity.css'), 'utf8');
  assert.match(phaseCss, /#view-explore \.discovery-results \{ grid-template-columns: repeat\(3/);
  assert.match(phaseCss, /@media \(max-width: 760px\)/);
  assert.match(phaseCss, /prefers-reduced-motion/);
});

test('Phase 7 artist and album surfaces disclose metadata gaps and use navigable accessible detail pages', () => {
  assert.match(html, /id="view-entity" aria-label="Catalogue detail page"/);
  assert.match(html, /id="entity-detail" hidden aria-labelledby="entity-title" aria-describedby="entity-description"/);
  assert.doesNotMatch(html, /aria-modal="true" role="dialog" aria-labelledby="entity-title"/);
  assert.match(html, /id="entity-breadcrumb-type"/);
  assert.match(html, /id="btn-copy-entity-link"/);
  assert.match(js, /history\.pushState\(\{starmusicsEntityRoute:true,returnRoute:state\.entityReturnRoute\}/);
  assert.match(js, /window\.addEventListener\('popstate',routeFromLocation\)/);
  assert.match(js, /function routeFromLocation\(\)/);
  assert.match(html, /id="entity-meta" aria-label="Catalogue information"/);
  assert.match(html, /id="entity-art-note"/);
  assert.match(js, /Demo metadata · verification pending/);
  assert.match(js, /Tracklist pending/);
  assert.match(js, /entity-meta-chip/);
  assert.match(js, /lastEntityTrigger/);
  assert.match(js, /focus\(\{preventScroll:true\}\)/);
});
