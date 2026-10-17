# Authorized audio delivery boundary

STARMUSICS Phase 6 deliberately adds an integration boundary rather than embedding a streaming vendor or hotlinking audio without permission.

## What can play today

A user can select a local audio file for the currently selected track after confirming they have permission to use it. The browser checks the file object's reported `audio/*` MIME type, positive size, and 500 MB cap, creates a session-only Blob URL, and plays it through the existing HTML audio engine. A browser-reported MIME type does not validate the file's actual encoded contents. Files are not uploaded or persisted. Blob URLs are revoked when the page is closed. The checkbox is a user confirmation, not a legal verification process.

## What cannot play by default

Catalogue records currently carry `rights.status: "unverified"`, `audio.status: "not-configured"`, and there are no active source adapters. Therefore the app must not stream remote audio for those records. A title, artwork URL, external API response or public webpage is not proof of a right to redistribute audio.

## Contract for a future approved provider

To enable a commercial or self-hosted audio source:

1. Document the rightsholder, permitted use, territories, expiration/review date, takedown path and any attribution obligations for every asset.
2. Set the track rights status to an explicit approved value only after verification; add an `audioSources` record with an active status, HTTPS or same-origin URL, an `audio/*` MIME type and a strict host allowlist.
3. Link the track to that source using `audio.status: "ready"` and `audio.sourceId`. The runtime returns a playable URL only when rights have a valid calendar timestamp and evidence reference, territory rules are explicit, the source is active, its host/protocol and MIME match pass, and the requested territory is permitted.
4. For production, issue URLs from a trusted backend where access control or expiring signatures are needed. Do not place provider API secrets in frontend JavaScript or trust browser storage for permission checks.
5. Test byte-range requests/seeking, CORS, content-type, expiry, territory denial, removed assets, provider outages, abuse reporting and takedown handling.

No provider has been selected or configured in this phase. That is intentional; the source interface can accommodate a legally approved provider without coupling the catalogue schema to an unchosen service.
