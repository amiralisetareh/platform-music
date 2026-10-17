# STARMUSICS catalogue model — Phase 6

`data/catalog.json` is the catalogue source of truth. `catalog-data.js` is a generated browser payload: edit the JSON and run `npm run build:catalog` rather than editing the generated JS directly.

## Entity relationships

- **Artist**: stable `id`, display `name`, optional artwork and biography.
- **Album**: stable `id`, an `artistId`, optional artwork and `trackIds`.
- **Track**: stable `id`, `artistId`, optional `albumId`, `genreIds`, `durationMs`, artwork, explicit flag, `audio` configuration, `rights` status, and an availability label. A standalone single is modeled as a track with `releaseType: "single"`, not as an album.
- **Playlist**: stable `id`, editorial metadata, and ordered `trackIds`.
- **Genre**: stable `id`, display name, optional description.

`legacyId` and `legacyRank` are migration aliases for existing browser-local Likes and playlists. New code should persist canonical IDs. The runtime checks unique IDs, validates rights/source configuration and verifies track/album/artist/genre/playlist references before the UI starts.

## Prototype guarantees and limits

- The current entries are seed/demo metadata, not a verified commercial catalogue.
- All demo audio rights are `unverified`, all track audio states are `not-configured`, and `audioSources` is intentionally empty.
- Search and catalogue entity detail use the normalized model. The UI's legacy-shaped view is produced by `Catalog.getLegacyData()` during startup, so visual components can be migrated incrementally without maintaining another hand-edited list.
- Local preferences, likes and user playlists remain in the browser. This is not account storage, cross-device sync or server authorization.
