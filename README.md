# STARMUSICS v0.9.0 — Consolidated Release

**Music, with intention.** STARMUSICS is a responsive music-discovery, player, and community prototype built around a light Apple-inspired clear-glass visual system. This release consolidates the work completed across the current five-phase product/design roadmap while retaining the earlier catalogue, account, persistence, and audio-rights foundations.

> **Status:** the interface, local account API, persistent community backend, and automated tests are available. This is not yet a production-ready streaming service: the audio manifest is empty, catalogue metadata remains demo-seeded, email verification/password recovery are not implemented, and deployment hardening and real-browser QA remain required.

## What is included

### Product/design roadmap — Phases 1–5

1. **Home and navigation:** clear-glass Home hierarchy, desktop icon rail, mobile bottom navigation, language menu, reduced-motion handling.
2. **Search and discovery:** search-led Explore, category filters, genre browsing, artist and album detail surfaces, explicit catalogue-status messaging.
3. **Listening experience:** mini/dock, expanded/full-page player, queue reorder/remove/clear, Media Session integration where supported, and three track-card export themes.
4. **Discussions and profiles:** searchable topics, comments, likes, profiles, activity metrics, achievements, public member views, and responsive community layouts.
5. **Shared community backend:** SQLite-backed topics and comments, reactions, reports, one-time owner claim, moderator roles, hide/restore actions, role management, audit records, same-origin write checks, and safe local frontend serving.

### Earlier technical foundations

The underlying project also retains its normalized catalogue and catalogue audits, rights-gated audio-source resolver, account registration/login, hashed password storage, persistent SQLite sessions and account/library sync. Earlier files named `PHASE-1-NOTES.md` through `PHASE-8-NOTES.md` describe the original technical foundation plan. The five-phase roadmap above is the later product/design sequence; the numbering is separate.

## Quick start — local development

Requirements: **Node.js 22.5 or newer**. The server uses the built-in `node:sqlite` module; no runtime npm dependency installation is required.

1. Copy `.env.example` to `.env`.
2. Generate an owner-claim token with `openssl rand -hex 32` and replace the placeholder value for `STARMUSICS_OWNER_SETUP_TOKEN` in `.env`.
3. In terminal one, start the API:

   ```sh
   npm run start:api
   ```

4. In terminal two, start the safe frontend server:

   ```sh
   npm run start:web
   ```

5. Open **http://127.0.0.1:8080**. Keep using this exact host and port unless you update `PUBLIC_ORIGIN` to match the browser origin.
6. Create an account and sign in. For the first installation owner, enter the one-time setup token in the owner setup panel. After the owner role is successfully claimed, remove `STARMUSICS_OWNER_SETUP_TOKEN` from the environment and restart the API.

The frontend server binds to `127.0.0.1` by default and serves only the approved UI assets. It deliberately does **not** expose `.env`, database files, source folders, tests, schemas, or project documentation. Do not replace it in this setup with a generic static server pointed at the entire repository while a secret-bearing `.env` file exists.

### Environment variables

- `PUBLIC_ORIGIN`: exact browser origin allowed by the API; default `http://127.0.0.1:8080`.
- `API_HOST`: API bind address; default `127.0.0.1` for local safety. For deployment, bind only to the private interface required by your reverse proxy/container network.
- `PORT`: API port; default `8787`.
- `STARMUSICS_DATA_DIR`: private persistent database directory. Default is `../starmusics-private-data`, outside the project/static root.
- `STARMUSICS_OWNER_SETUP_TOKEN`: random secret of at least 32 characters, used only for initial owner claim. Remove after the claim.
- `WEB_HOST` / `WEB_PORT`: safe frontend server bind host and port; default `127.0.0.1:8080`.

Keep the database directory backed up and inaccessible to the static frontend. For a real deployment, host the frontend from an asset root containing only public assets and deploy the API behind HTTPS with appropriate operational controls.

## Verification

Run the complete automated suite and catalogue/audio audits:

```sh
npm run verify
```

The verification command regenerates the browser catalogue payload, runs catalogue and audio-rights audits, checks JavaScript syntax and CSS structure, and executes automated tests. The safe frontend server also has tests that verify `.env`, source files, database-adjacent paths, and path traversal are not served.

## Community security model

- Reading topics and visible comments is public.
- Signing in is required to post comments, react, report content, and view private moderation queues.
- Only the installation owner can create curated topics or grant/revoke moderator roles.
- Moderators and the owner can review reports and hide/restore comments.
- Report payloads omit email addresses; public member payloads expose only display name, bio, community role label, and visible comment count.
- Comment text is length-limited and inserted/rendered as text; dynamic interface output is escaped.
- Writes require a same-origin `Origin` header, use JSON request bodies, and are rate-limited in-process.
- The owner is claimed once via a high-entropy server-configured secret. The API does not infer ownership from an email address.
- The local frontend server serves an explicit allowlist of public files and refuses source/private paths.

This is a solid local prototype foundation, not a security certification. Before public deployment, add verified email/password recovery, documented administrator recovery, externalized/distributed rate limiting if needed, backups and restore drills, log/monitoring policy, privacy/retention and moderation policy, dependency/runtime update procedures, HTTPS reverse-proxy configuration, and independent security review. The current rate limiter and API are single-process.

## Honest content and audio status

The current catalogue contains demonstration metadata (6 tracks, 12 artists, 4 albums, 5 playlists). Some album tracklists and editorial playlists are intentionally incomplete rather than fabricated. **No demo track is enabled for playback with verified distribution rights.** `data/audio-library.json` is an empty, valid manifest; adding playable tracks requires files the operator has permission to distribute and verifiable rights evidence/territories. The player UI and queue mechanics can be tested, but that does not mean the project ships a licensed music catalogue.

Lyrics are not included in share cards because verified lyric content has not been supplied. Third-party artwork references are prototype imagery and should be replaced or checked for usage rights before launch.

## Current manual QA still required

Automated tests do not replace a real-browser/device pass. Before release beyond local development, manually verify desktop and mobile breakpoints, keyboard-only flows, Persian RTL and Russian labels, dialogs/focus restoration, actual account cookie behavior on the chosen deployment origin, moderation workflows with multiple accounts, and supported browser audio controls. The browser-based screenshot inspection was not completed in the development environment.

## Important files

- `index.html`, `styles.css`, `app.js`, `design/`: frontend and cumulative design system.
- `data/catalog.json`: canonical demo catalogue; run `npm run build:catalog` after intentional edits.
- `data/audio-library.json`, `public/media/audio/README.md`: rights-cleared audio-library boundary and workflow.
- `server/api.mjs`, `server/start.mjs`: account/community API.
- `scripts/start-web.mjs`: safe local frontend server.
- `tests/`: API, catalogue, rights, player, design, community authorization, and safe-static-server tests.
- `design/PHASE-1-HOME-NAVIGATION.md` through `design/PHASE-5-COMMUNITY-BACKEND.md`: current product/design roadmap specifications.
- `RELEASE-NOTES.md`: this consolidated release record.
