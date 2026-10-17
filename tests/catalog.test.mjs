import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = path => readFileSync(resolve(root, path), 'utf8');
const source = JSON.parse(read('data/catalog.json'));
const serviceText = read('catalog-service.js');
const runtime = { STARMUSICS_CATALOG_SOURCE: source, location: { origin: 'https://starmusics.test' } };
new Function('window', serviceText)(runtime);
const catalog = runtime.STARMUSICS_CatalogRuntime.create(source);

test('catalogue data has unique stable identifiers and valid entity relationships', () => {
  const report = runtime.STARMUSICS_CatalogRuntime.validate(source);
  assert.equal(report.valid, true, report.errors.join('\n'));
  for (const type of ['artists', 'albums', 'tracks', 'playlists', 'genres']) {
    const ids = source[type].map(record => record.id);
    assert.equal(new Set(ids).size, ids.length, `${type} has duplicate IDs`);
    assert.ok(ids.every(id => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)), `${type} has a non-canonical ID`);
  }
  assert.ok(source.tracks.every(track => Number.isInteger(track.durationMs) && track.durationMs > 0));
  assert.ok(source.tracks.every(track => track.artistId && source.artists.some(a => a.id === track.artistId)));
});

test('catalogue uses metadata-only demo records and cannot stream unverified audio', () => {
  assert.equal(source.policy.allowUnverifiedRemoteAudio, false);
  assert.deepEqual(source.audioSources, []);
  assert.ok(source.tracks.every(track => track.availability === 'metadata-only'));
  assert.ok(source.tracks.every(track => track.rights.status === 'unverified'));
  assert.ok(source.tracks.every(track => track.audio.status === 'not-configured' && track.audio.url === null));
  assert.equal(catalog.getPlayableSource(source.tracks[0].id), null);
});

test('catalogue search covers tracks, artists, albums, playlists and genres', () => {
  assert.ok(catalog.search('Lyfestyle').some(hit => hit.type === 'Track' && hit.title === 'Lyfestyle'));
  assert.ok(catalog.search('Kendrick Lamar').some(hit => hit.type === 'Artist'));
  assert.ok(catalog.search('DS2').some(hit => hit.type === 'Album'));
  assert.ok(catalog.search('Sicko Mode').some(hit => hit.type === 'Track'));
  assert.ok(!catalog.search('Sicko Mode').some(hit => hit.type === 'Album'), 'a single should not be typed as an album');
  assert.ok(catalog.search('Persian Trap').some(hit => hit.type === 'Playlist'));
  assert.ok(catalog.search('Electronic').some(hit => hit.type === 'Genre'));
  assert.equal(catalog.search('    ').length, 0);
});

test('legacy IDs still resolve to canonical track records', () => {
  const byLegacy = catalog.getTrack('1');
  const byCanonical = catalog.getTrack(byLegacy.id);
  assert.equal(byLegacy.id, byCanonical.id);
  assert.equal(byLegacy.legacyId, '1');
  assert.equal(catalog.getTrack('Lyfestyle').id, byLegacy.id);
  assert.equal(catalog.getLegacyData().trending.length, source.editorial.trendingTrackIds.length);
  assert.ok(catalog.getLegacyData().releases.some(item => item.title === 'Sicko Mode (Remix)' && item.releaseType === 'single'));
  assert.ok(!catalog.getLegacyData().albums.some(item => item.title === 'Sicko Mode (Remix)'));
});

test('local audio requires explicit permission, audio MIME, positive size and size limit', () => {
  const validator = runtime.STARMUSICS_AudioSourceAdapter.validateLocalFile;
  assert.equal(validator({ type: 'audio/mpeg', size: 1024 }, false).valid, false);
  assert.equal(validator({ type: 'text/plain', size: 1024 }, true).valid, false);
  assert.equal(validator({ type: 'audio/mpeg', size: 0 }, true).valid, false);
  assert.equal(validator({ type: 'audio/mpeg', size: 501 * 1024 * 1024 }, true).valid, false);
  assert.equal(validator({ type: 'audio/', size: 1024 }, true).valid, false);
  assert.equal(validator({ type: 'audio/mpeg', size: Number.POSITIVE_INFINITY }, true).valid, false);
  assert.equal(validator({ type: 'audio/mpeg', size: 500 * 1024 * 1024 }, true).valid, true);
  assert.equal(validator({ type: 'audio/mpeg', size: 1024 }, true).valid, true);
});

test('remote audio source resolution fails closed unless rights and source allowlist are valid', () => {
  const unverifiedEvidence = structuredClone(source);
  unverifiedEvidence.tracks[0].rights.status = 'licensed';
  unverifiedEvidence.tracks[0].audio.status = 'ready';
  unverifiedEvidence.tracks[0].audio.sourceId = 'provider-main';
  unverifiedEvidence.audioSources = [{ id: 'provider-main', status: 'active', url: 'https://media.example.test/track.mp3', mimeType: 'audio/mpeg', allowedHosts: ['media.example.test'] }];
  assert.throws(() => runtime.STARMUSICS_CatalogRuntime.create(unverifiedEvidence), /rights evidence reference and valid ISO-8601 verification timestamp/);

  const active = structuredClone(source);
  const track = active.tracks[0];
  track.rights.status = 'licensed';
  track.rights.rightsHolder = 'Example Rights Holder';
  track.rights.verifiedAt = '2026-01-01T00:00:00Z';
  track.rights.evidenceRef = 'license-record:example-001';
  track.rights.territories = ['*'];
  track.audio.status = 'ready';
  track.audio.sourceId = 'provider-main';
  track.audio.mimeType = 'audio/mpeg';
  active.audioSources = [{ id: 'provider-main', status: 'active', url: 'https://media.example.test/track.mp3', mimeType: 'audio/mpeg', allowedHosts: ['media.example.test'] }];
  const okCatalog = runtime.STARMUSICS_CatalogRuntime.create(active);
  assert.equal(okCatalog.getPlayableSource(track.id).url, 'https://media.example.test/track.mp3');
  assert.equal(okCatalog.getPlayableSource(track.id, 'us').url, 'https://media.example.test/track.mp3');

  const noTerritory = structuredClone(active);
  noTerritory.tracks[0].rights.territories = [];
  assert.throws(() => runtime.STARMUSICS_CatalogRuntime.create(noTerritory), /explicit territory list/);

  const malformedDate = structuredClone(active);
  malformedDate.tracks[0].rights.verifiedAt = 'tomorrow';
  assert.throws(() => runtime.STARMUSICS_CatalogRuntime.create(malformedDate), /valid ISO-8601 verification timestamp/);

  active.audioSources[0].allowedHosts = ['elsewhere.example.test'];
  assert.throws(() => runtime.STARMUSICS_CatalogRuntime.create(active), /host must match its allowlist/);

  active.audioSources[0].allowedHosts = ['media.example.test'];
  active.audioSources[0].url = 'http://media.example.test/track.mp3';
  assert.throws(() => runtime.STARMUSICS_CatalogRuntime.create(active), /must use HTTPS/);

  const credentials = structuredClone(source);
  const guardedTrack = credentials.tracks[0];
  guardedTrack.rights = { status: 'licensed', rightsHolder: 'Example Rights Holder', verifiedAt: '2026-01-01T00:00:00Z', evidenceRef: 'license-record:example-001', territories: ['*'] };
  guardedTrack.audio = { status: 'ready', sourceId: 'provider-main', url: null, mimeType: 'audio/mpeg' };
  credentials.audioSources = [{ id: 'provider-main', status: 'active', url: 'https://user:pass@media.example.test/track.mp3', mimeType: 'audio/mpeg', allowedHosts: ['media.example.test'] }];
  assert.throws(() => runtime.STARMUSICS_CatalogRuntime.create(credentials), /without credentials/);
});

test('browser pages load the generated catalogue and service before app code', () => {
  const html = read('index.html');
  assert.ok(html.indexOf('catalog-data.js') < html.indexOf('catalog-service.js'));
  assert.ok(html.indexOf('catalog-service.js') < html.indexOf('app.js'));
  assert.match(html, /id="audio-rights-confirm"/);
  assert.match(read('app.js'), /Catalog\.search\(query\)/);
  assert.match(read('app.js'), /validateLocalFile\(file/);
});

test('generated catalogue runtime file matches the canonical JSON export', () => {
  const result = spawnSync(process.execPath, ['scripts/export-catalog.mjs'], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const generated = read('catalog-data.js');
  assert.match(generated, /Generated from data\/catalog\.json/);
  assert.match(generated, /STARMUSICS_CATALOG_SOURCE/);
});

test('Previous-track navigation does not duplicate entries in forward history', () => {
  const app = read('app.js');
  const previousLogic = app.slice(app.indexOf('function prevTrack()'), app.indexOf('function updateQueueUI()'));
  assert.match(previousLogic, /state\.forwardTracks\.push\(state\.current\)/);
  assert.equal((previousLogic.match(/state\.forwardTracks\.push\(state\.current\)/g) || []).length, 1);
});

test('catalogue contract aligns schema requirements with runtime requirements', () => {
  const schema = JSON.parse(read('schemas/catalog.schema.json'));
  for (const key of ['audioSources', 'editorial', 'discussionTopics']) assert.ok(schema.required.includes(key), `${key} must be required by schema`);
  assert.equal(schema.properties.policy.properties.allowUnverifiedRemoteAudio.const, false);
  assert.equal(schema.properties.policy.properties.audioDelivery.const, 'allowlisted-sources-only');
});

test('runtime validator rejects incomplete entities and inconsistent album-track relationships', () => {
  const missingArtistName = structuredClone(source);
  delete missingArtistName.artists[0].name;
  assert.match(runtime.STARMUSICS_CatalogRuntime.validate(missingArtistName).errors.join('\n'), /non-empty name/);

  const missingPlaylistKind = structuredClone(source);
  delete missingPlaylistKind.playlists[0].kind;
  assert.match(runtime.STARMUSICS_CatalogRuntime.validate(missingPlaylistKind).errors.join('\n'), /must declare kind/);

  const brokenAlbumLink = structuredClone(source);
  brokenAlbumLink.tracks[0].albumId = brokenAlbumLink.albums[0].id;
  assert.match(runtime.STARMUSICS_CatalogRuntime.validate(brokenAlbumLink).errors.join('\n'), /missing from its trackIds/);
});

test('rights verification timestamps reject impossible calendar dates and invalid offsets', () => {
  for (const badDate of ['2026-02-31T00:00:00Z', '2026-04-10T25:00:00Z', '2026-04-10T10:00:00+14:30', '2026-04-10T10:00:00']) {
    const candidate = structuredClone(source);
    const track = candidate.tracks[0];
    Object.assign(track.rights, { status: 'licensed', rightsHolder: 'Example Rights Holder', verifiedAt: badDate, evidenceRef: 'license-record:example-001', territories: ['US'] });
    track.audio = { status: 'ready', sourceId: 'provider-main', url: null, mimeType: 'audio/mpeg' };
    candidate.audioSources = [{ id: 'provider-main', status: 'active', url: 'https://media.example.test/track.mp3', mimeType: 'audio/mpeg', allowedHosts: ['media.example.test'] }];
    const report = runtime.STARMUSICS_CatalogRuntime.validate(candidate);
    assert.equal(report.valid, false, `accepted invalid timestamp ${badDate}`);
    assert.match(report.errors.join('\n'), /valid ISO-8601 verification timestamp/);
  }
});

test('playable-source resolution rechecks territory, verification and MIME consistency', () => {
  const candidate = structuredClone(source);
  const track = candidate.tracks[0];
  Object.assign(track.rights, { status: 'licensed', rightsHolder: 'Example Rights Holder', verifiedAt: '2026-01-01T00:00:00Z', evidenceRef: 'license-record:example-001', territories: ['US'] });
  track.audio = { status: 'ready', sourceId: 'provider-main', url: null, mimeType: 'audio/mpeg' };
  candidate.audioSources = [{ id: 'provider-main', status: 'active', url: 'https://media.example.test/track.mp3', mimeType: 'audio/mpeg', allowedHosts: ['media.example.test'] }];
  const approved = runtime.STARMUSICS_CatalogRuntime.create(candidate);
  assert.equal(approved.getPlayableSource(track.id, 'US')?.mimeType, 'audio/mpeg');
  assert.equal(approved.getPlayableSource(track.id, 'CA'), null);
  assert.equal(approved.getPlayableSource(track.id), null);

  candidate.audioSources[0].mimeType = 'audio/ogg';
  const mimeMismatch = runtime.STARMUSICS_CatalogRuntime.create(candidate);
  assert.equal(mimeMismatch.getPlayableSource(track.id, 'US'), null);
});
