import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const catalog = JSON.parse(await readFile(new URL('data/catalog.json', root), 'utf8'));
const runtime = await readFile(new URL('catalog-service.js', root), 'utf8');
const sandbox = { STARMUSICS_CATALOG_SOURCE: catalog, location: { origin: 'https://starmusics.invalid' } };
vm.runInNewContext(runtime, { window: sandbox, URL }, { timeout: 1000 });
const validation = sandbox.STARMUSICS_CatalogRuntime.validate(catalog);
if (!validation.valid) {
  console.error('Catalogue schema validation failed:');
  for (const error of validation.errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  const artists = new Map(catalog.artists.map(item => [item.id, item]));
  const tracks = new Map(catalog.tracks.map(item => [item.id, item]));
  const emptyAlbums = catalog.albums.filter(album => album.trackIds.length === 0);
  const emptyPlaylists = catalog.playlists.filter(playlist => playlist.trackIds.length === 0);
  const unplayableTracks = catalog.tracks.filter(track => track.audio.status !== 'ready' || track.rights.status === 'unverified');
  const genreCoverage = catalog.genres.map(genre => ({ name: genre.name, count: catalog.tracks.filter(track => track.genreIds.includes(genre.id)).length }));
  const unlinkedAlbumTracks = catalog.tracks.filter(track => track.albumId && !catalog.albums.find(album => album.id === track.albumId)?.trackIds.includes(track.id));
  console.log('STARMUSICS catalogue audit');
  console.log(`Schema: valid (${catalog.tracks.length} tracks, ${catalog.artists.length} artists, ${catalog.albums.length} albums, ${catalog.playlists.length} playlists)`);
  console.log(`Playable with verified rights: ${catalog.tracks.length - unplayableTracks.length}/${catalog.tracks.length}`);
  console.log(`Albums without tracklists: ${emptyAlbums.length}${emptyAlbums.length ? ` (${emptyAlbums.map(item => item.title).join(', ')})` : ''}`);
  console.log(`Editorial playlists without tracks: ${emptyPlaylists.length}${emptyPlaylists.length ? ` (${emptyPlaylists.map(item => item.title).join(', ')})` : ''}`);
  console.log(`Tracks with broken album back-links: ${unlinkedAlbumTracks.length}`);
  console.log('Genre coverage:');
  for (const genre of genreCoverage) console.log(`- ${genre.name}: ${genre.count} track(s)`);
  console.log('Note: empty tracklists and unverified audio are warnings, not schema errors; do not invent track/album relationships or enable unlicensed playback to make these counts look better.');
}
