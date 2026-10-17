# Phase 5 — Community backend and moderation

## Scope

This phase connects the discussion/profile interface to an optional same-origin-protected Node API backed by SQLite. The frontend keeps a clearly labeled local-only fallback when the API is not reachable.

## Data model

- `community_topics`: seeded and owner-created topics, open/closed visibility state, sort order, timestamps.
- `community_comments`: user-owned comments with visible/hidden moderation state and moderation metadata.
- `community_comment_likes`: one reaction per member/comment pair.
- `community_reports`: one report per member/comment pair, a constrained reason, private details, triage status, resolution metadata.
- `community_roles`: owner and moderator assignments linked to account IDs.
- `community_audit_log`: owner claim, topic creation, report status, hide/restore and moderator-role changes.
- `app_meta`: one-time installation owner claim state.

## Authorization rules

| Action | Public | Signed-in member | Moderator | Owner |
|---|---:|---:|---:|---:|
| Read open topics and visible comments | Yes | Yes | Yes | Yes |
| Post comment, like, report | No | Yes | Yes | Yes |
| Read reports | No | No | Yes | Yes |
| Hide or restore comments | No | No | Yes | Yes |
| Create curated topics | No | No | No | Yes |
| Grant/revoke moderator role | No | No | No | Yes |
| Claim installation owner | No | Authenticated + secret | Authenticated + secret | Not repeatable |

Owner claim is enabled only if a server secret of at least 32 characters is configured and the installation has not been claimed. The claim operation is one-time and transactional. Ownership is not derived from a user-supplied email address. Remove the secret from the runtime environment after claiming the owner role.

## API routes

- `GET /api/community/status`, `/api/community/topics`
- `GET /api/community/topics/:topicId/comments`
- `POST /api/community/topics/:topicId/comments`
- `POST /api/community/comments/:commentId/like`
- `POST /api/community/comments/:commentId/report`
- `GET /api/community/members/:userId`, `/api/community/me`
- `POST /api/community/owner/claim`
- `POST /api/community/topics`
- `GET /api/community/reports`, `PATCH /api/community/reports/:reportId`
- `PATCH /api/community/comments/:commentId`
- `PUT /api/community/members/:userId/role`

Mutations require JSON and an exact configured `Origin`. Responses are no-store, public member/report serializers avoid exposing account emails, and actions are rate-limited in-process. Report reasons and status/moderation actions are enumerated; comment text is length-limited.

## Safe local frontend serving

Use `npm run start:web` instead of pointing a generic static server at the project root while `.env` exists. The script binds to `127.0.0.1` by default and serves only the public HTML, JS, CSS, and design CSS allowlist. It rejects `.env`, source folders, tests, documentation, catalogue source JSON, package metadata and traversal paths. Account/community database storage defaults to `../starmusics-private-data`, outside the project root.

## Verification

`tests/community-backend.test.mjs` covers persistence, public privacy boundaries, authorization, owner one-time claim, report triage, hiding/restoring, origin validation, limits, and UI integration. `tests/web-server.test.mjs` checks public asset access and denied sensitive paths. Run `npm run verify` for the complete suite.

## Not yet production-complete

The API and rate limits are single-process; there is no email verification, password reset or documented owner-recovery flow. Operators must define retention/moderation policies, backup/restore procedures, monitoring, HTTPS reverse proxy, secret management and incident response. Obtain an independent security review before a public launch.
