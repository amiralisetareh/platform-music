# STARMUSICS v0.9.0 — Consolidated Phases 1–5

This release consolidates the current product/design roadmap, from the Home/navigation system through shared community persistence and moderation, on top of the earlier catalogue, player, account, and SQLite storage foundations.

## Included

- **Phase 1 — Home & navigation:** preserved light clear-glass system, desktop icon rail, mobile bottom navigation, Home hierarchy and responsive spacing.
- **Phase 2 — Search & discovery:** Explore/search, filters, genre discovery and improved artist/album views with explicit metadata-state messaging.
- **Phase 3 — Listening experience:** player modes, queue controls, focus/keyboard behavior, progressive system media actions and track-card export themes.
- **Phase 4 — Community & profiles:** searchable/sortable topics, public profiles, activity metrics, achievements, comments and local fallback mode.
- **Phase 5 — Shared community backend:** SQLite-backed community topics/comments/likes/reports; member-safe public profiles; one-time owner claim; owner topic creation and moderator role management; hide/restore actions; auditable moderation changes; same-origin write requirements and per-process rate limits.
- Safe local web server that serves an explicit list of frontend assets and blocks `.env`, source folders, test files, project docs, and path traversal.
- Database storage defaults to a private sibling directory rather than the static web root.
- Automated tests for API persistence/authorization, community UI integration, CSS structure, audio rights handling, and frontend file-serving boundaries.

## Verification

The release is validated using `npm run verify`, including catalogue generation/audit, explicit-rights audio audit, JavaScript syntax checks, CSS structure checks, and the full Node test suite. The ZIP is separately checked for integrity before delivery.

## Known limitations and launch blockers

- Catalogue metadata is still demo-seeded and incomplete: 6 tracks, 12 artists, 4 albums, 5 playlists; four albums lack tracklists and five editorial playlists are empty.
- The rights-cleared audio manifest contains zero files; 0/6 demo tracks have verified rights for playback. No unverified audio is enabled.
- Password reset and email verification are not implemented. Owner setup uses a high-entropy one-time secret, which must be removed after the first owner claim.
- API rate limits and state caches are process-local; this is not a multi-instance deployment design.
- External hosting, HTTPS reverse proxy, backup/restore, monitoring, privacy/retention policy, content moderation policy, and independent security review remain production tasks.
- Browser screenshot/device verification remains outstanding; automated tests do not imply visual QA has passed.

The consolidated release is suitable for continued development and controlled local testing, not an unrestricted public launch.
