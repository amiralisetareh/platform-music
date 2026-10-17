# STARMUSICS 0.8.1 — Stabilization Release

This release stabilizes the cumulative Phase 1–8 prototype. It preserves the existing light, clear-glass interface and navigation rather than redesigning it.

## Changes

- Artwork fallback now covers failed `<img>` sources and inline CSS background artwork. Recycled cards can recover when a later render provides a different URL.
- Curated playlist cards open editorial details rather than treating a playlist as a playable track. The Home CTA is **Explore mix**, and opens the curated playlist detail sheet instead of creating a fictional “Persian Trap Mix” track.
- Album cards open album details and surface pending tracklist status honestly. No track-to-album or playlist relationships were invented merely to fill empty lists.
- Added save/remove album controls and a Saved Albums section in the Library. Saved IDs are stored locally and included in the account library-sync payload.
- The “First listen” achievement only unlocks after the HTML audio element emits a real `play` event, not when metadata is merely selected.
- The language switcher now observes newly rendered DOM content and applies translations to matching dictionary entries. Persian still requires a full human translation review.
- Added `config.js` so the API base URL has one explicit configuration point, and added an API startup script that loads an optional `.env` file before importing the API module.
- Added targeted stabilization regression tests.
- Removed SQLite database, WAL, and SHM runtime artifacts from the release source tree; account data must be created at runtime.

## Run locally

Use Node.js 22.5 or newer. Optionally copy `.env.example` to `.env`. Start the API with `npm run start:api` and serve the static frontend in a second terminal with `python3 -m http.server 8080`. Open `http://localhost:8080`.

`npm run verify` rebuilds the catalogue, checks JavaScript syntax, and runs the automated tests. It does not replace interactive browser, accessibility, security, or real-device QA.

## Still not production-ready

The catalogue remains metadata-only, with audio rights unverified and no licensed streaming source configured. Editorial playlist tracklists are intentionally marked pending where relationships are absent. Discussions remain browser-local. The account API is a single-process prototype and still lacks email verification, password recovery, distributed rate limiting, operational monitoring, and a production security review.
