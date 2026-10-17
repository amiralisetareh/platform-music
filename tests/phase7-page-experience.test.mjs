import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (name) => readFileSync(resolve(root, name), 'utf8');
const html = read('index.html');
const app = read('app.js');
const css = read('design/phase-7-page-experience.css');
const server = read('scripts/start-web.mjs');

 test('Phase 7 stylesheet is served and loaded after the previous page feature layers', () => {
  const stylesheetLinks = [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g)].map((match) => match[1]);
  assert.ok(stylesheetLinks.includes('design/phase-7-page-experience.css'));
  assert.ok(stylesheetLinks.indexOf('design/phase-7-page-experience.css') > stylesheetLinks.indexOf('design/phase-5-community-backend.css'));
  assert.ok(stylesheetLinks.indexOf('design/tokens.css') > stylesheetLinks.indexOf('design/phase-7-page-experience.css'));
  assert.ok(stylesheetLinks.indexOf('design/phase-6-quality.css') > stylesheetLinks.indexOf('design/tokens.css'));
  assert.match(server, /phase-\[1-7\]/);
});

test('Home hierarchy describes editorial content honestly and promotes Explore as the main action', () => {
  assert.match(html, /Find your next sound/);
  assert.match(html, /data-go-view="explore"/);
  assert.match(html, /Selected releases &amp; tracks/);
  assert.match(html, /Editorial playlists/);
  assert.match(html, /Artist discovery/);
  assert.match(html, /not a live chart or streaming ranking/i);
});

test('artist, album, genre and playlist details are navigable pages rather than modal overlays', () => {
  assert.match(html, /id="view-entity" aria-label="Catalogue detail page"/);
  assert.match(html, /id="entity-detail" hidden aria-labelledby="entity-title" aria-describedby="entity-description"/);
  assert.doesNotMatch(html, /id="entity-detail"[^>]*aria-modal|id="entity-detail"[^>]*role="dialog"/);
  assert.match(html, /id="entity-breadcrumb-type"/);
  assert.match(html, /id="btn-copy-entity-link"/);
  assert.match(css, /#view-entity \.entity-detail-sheet/);
  assert.match(css, /@media\s*\(max-width:\s*760px\)/);
  assert.match(css, /entity-breadcrumbs/);
});

test('entity routes use canonical catalogue IDs and respond to browser history', () => {
  assert.match(app, /function resolveEntityRecord\(kind, value\)/);
  assert.match(app, /Catalog\.getArtist, album: Catalog\.getAlbum, genre: Catalog\.getGenre, playlist: Catalog\.getPlaylist/);
  assert.match(app, /#\/\$\{kind\}\/\$\{encodeURIComponent\(record\.id\)\}/);
  assert.match(app, /function routeFromLocation\(\)/);
  assert.match(app, /window\.addEventListener\('popstate',routeFromLocation\)/);
  assert.match(app, /window\.addEventListener\('hashchange',routeFromLocation\)/);
  assert.match(app, /history\.back\(\)/);
  assert.match(app, /Copied|Page link copied/);
  assert.match(app, /navigator\.clipboard\?\.writeText/);
});

test('contextual sidebar changes with the current view and avoids unsupported live-ranking claims', () => {
  assert.match(html, /id="rightbar"/);
  assert.match(html, /data-sidebar-for="home"/);
  assert.match(html, /id="sidebar-context-panel" hidden aria-live="polite"/);
  assert.match(app, /function renderContextualSidebar\(viewName\)/);
  assert.match(app, /data-sidebar-for/);
  assert.match(app, /renderContextualSidebar\(name\)/);
  assert.match(app, /rightbar-empty/);
});

test('genre cards and detail counts are derived from current catalogue relationships', () => {
  assert.match(app, /function renderGenreCards\(container\)/);
  assert.match(app, /Catalog\.getTracks\(\)\.filter\(track => \(track\.genreIds \|\| \[\]\)\.includes\(genre\.id\)\)/);
  assert.match(app, /data-open-genre/);
  assert.match(app, /No linked tracks yet/);
  assert.match(css, /\.genre-card-rich/);
});
