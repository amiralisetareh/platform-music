# Phase 7 — Home, Navigation & Page Experience

## Goal

Make STARMUSICS feel coherent across the main browsing journey while preserving the light Apple-inspired clear-glass visual direction and the established music player/community behavior.

## Changes

### Home hierarchy
- Keep the order: one discovery-led hero, quick genre entry points, selected releases/tracks, editorial playlists, artist discovery, then a compact community preview.
- Replace wording that implied verified Persian Trap playlist content or live trend/release rankings with neutral catalogue-preview wording.
- Keep the Save selection control and its existing local/library integration intact, but label it as an editorial selection rather than a guaranteed playable mix.

### Contextual right sidebar
- Home shows catalogue highlights and a small discussion panel.
- Explore shows linked genres and track relationship counts.
- Artist, album and genre pages show linked related discovery and relevant counts.
- Library and personal views show collection shortcuts and local/synced status context.
- Discussions shows community guidance rather than duplicating the full Home layout.
- About does not reserve a large empty sidebar column on desktop.

### Genre cards
- Show genre name, ordinal visual index, linked-track count, and an explicit empty coverage label where there are no linked tracks.
- Counts are calculated from normalized catalogue relationships; they are not claims of playable audio.

### Navigable catalogue details
- Artist, album, genre, and editorial playlist details are rendered as first-class page views instead of a centered modal overlay.
- Stable canonical IDs form client-side share URLs: `#/artist/<id>`, `#/album/<id>`, `#/genre/<id>`, `#/playlist/<id>`.
- Route loading supports direct hash URLs, navigation links, back/forward, breadcrumbs, return action, and copying the current page URL.
- Existing artist/album/genre/playlist entry points (cards, search, related discovery, saved albums) reuse the same route path.
- Unknown route IDs fall back safely to Home.

### Artwork and layout consistency
- Standardize square album/track cover crops and consistent context/sidebar thumbnails.
- Detail pages use an editorial two-column layout on wide screens and a single-column layout on mobile.
- Add no new palette or dark theme; reuse canonical design tokens and shared focus behavior.

## Files

- `index.html`: Phase 6 style imports, route view, sidebar contexts, clarified Home copy.
- `app.js`: hash route state, back/forward, contextual sidebar rendering, accurate genre counts, detail-page interactions.
- `design/phase-7-page-experience.css`: page hierarchy, contextual sidebar, genre cards, entity-route layout, responsive rules.
- `scripts/start-web.mjs`: safe CSS allowlist extended through Phase 7.
- `scripts/audit-design-system.mjs`, `scripts/check-design-css.mjs`, `tests/phase7-page-experience.test.mjs`: audit integration and regression coverage.

## Verification

Run `npm run verify`. This release passed 82 automated tests plus catalogue, audio-rights, design-token/contrast, JavaScript syntax, and CSS structural checks. A runtime smoke test served the homepage and Phase 7 stylesheet (HTTP 200) while refusing `.env` and server-source paths (HTTP 404). Source-level tests confirm route hooks, page structure, CSS order, static-server allowlist, and catalogue-derived counts; they do not prove rendered visual quality or browser history works perfectly across all browsers.

## Limitations and QA

- This is a hash router on the static frontend; URLs are shareable but not server-rendered and have limited SEO benefits.
- Browser-level screenshots and interactive device tests were not completed in the current environment.
- The existing data catalogue is still demonstration data. Blank tracklists and zero approved audio remain intentional; no fabricated relationships or rights claims were added.
- Translation strings added by this phase are not fully localized yet; complete localization is the next planned phase.
