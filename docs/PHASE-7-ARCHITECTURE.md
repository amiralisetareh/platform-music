# Phase 7 — persistence and API boundary

## Included
- Dependency-free Node HTTP API (`server/start.mjs`, `server/api.mjs`).
- File-backed account store for local development (`data-server/accounts.json`, excluded from version control).
- Registration/login with scrypt password hashes, random session IDs, HttpOnly + SameSite=Lax cookies, generic login errors, bounded request bodies, origin checks, and no-store JSON responses.
- Authenticated profile and library endpoints; user-owned data is never selected by a client-supplied user ID.
- Library normalization/deduplication, bounded profile/playlist fields, and sanitized metadata for liked tracks and playlist entries.
- Serialized JSON writes to avoid concurrent requests overwriting the development store's temporary file.
- Basic per-process IP/route throttling on registration and login, in addition to bounded request bodies and origin checks.
- Security headers on API responses. Production startup requires an HTTPS `PUBLIC_ORIGIN`; session cookies gain `Secure` in production.
- Frontend account dialog with registration, login, logout, profile synchronization, liked-track metadata synchronization, personal playlist synchronization, first-account local-library migration, and local-only fallback when the API is offline.

## API
- `GET /api/health` — service health.
- `POST /api/register` — `{ "email": "…", "password": "at least 12 chars" }`.
- `POST /api/login` — same credentials.
- `POST /api/logout` — clear current session.
- `GET /api/me` — current account.
- `PUT /api/profile` — `{ "name": "…", "bio": "…" }`.
- `PUT /api/library` — liked track IDs and metadata, saved album IDs, playlist IDs, and playlists with stable IDs plus bounded track metadata.

The integrated frontend uses `credentials: 'include'`. Run `npm run start:api` and serve the frontend at `http://localhost:8080`; the default API listens on `http://localhost:8787` and defaults to that exact frontend origin. Configure `PUBLIC_ORIGIN` to the exact frontend origin if host or port differs. The default browser API URL is the local port 8787 for localhost/127.0.0.1; set `window.STARMUSICS_API_BASE` before `app.js` if your deployment needs a different URL. For production, use HTTPS and a reverse proxy with network-level rate limiting, backups, monitoring, and a managed database. The included JSON store is a development persistence adapter, not a multi-instance production database.

## Security limitations / production blockers
This phase provides a tested starting API, not a complete production security review. The included authentication routes have basic process-local rate limiting, but also add edge/network-level rate limiting and email verification/password reset before public launch. Use a managed database with migrations/backups for production. Sessions are currently in memory and are invalidated on API restart; use a persistent session store for production. Logout requires the API to be reachable so the server can revoke the active session. Configure HTTPS, restrictive deployment/network access, log redaction, and operational backups. No music streaming provider or distribution rights are included.
