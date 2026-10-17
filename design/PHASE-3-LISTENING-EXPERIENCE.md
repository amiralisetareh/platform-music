# STARMUSICS Design Phase 3 — Listening Experience

## Design intent

The player is a core surface, not an accessory. This phase continues the existing white/off-white clear-glass design and improves the connection between playback controls, the queue, lyric availability, mobile ergonomics, and system-level media controls. It does not redesign the rest of the application.

## Player states

- **Dock:** the compact, persistent player for normal browsing. It remains hidden until a track is selected.
- **Full player:** a responsive, near-full-screen listening surface with artwork, transport, progress, queue access, volume, and lyrics availability. It receives keyboard focus on open, returns focus on close, and keeps Tab navigation within the dialog.
- **Mini:** a small floating glass player with direct play/pause and restore/expand controls. The bottom-nav safe-area spacing remains part of the layout.

## Queue behavior

Queue entries can be played, moved up/down, removed, or cleared. Selecting a queued item advances the queue to the entries after that item; skipped entries do not remain in the queue. Empty-queue and queue-count copy update with the data. Manual queue edits exit shuffle mode to prevent a misleading state.

## System media controls

Where the browser supports the Media Session API, STARMUSICS publishes current track metadata and registers play/pause, previous/next, and seek actions. Unsupported actions are ignored safely. Playback remains functional without Media Session support.

## Share-card styles and lyric permissions

Three selectable themes are available for exported PNG track cards: **Clear glass**, **Afterglow**, and **Paper**. The selected theme is saved on the device. The current catalogue has no verified lyric entries, so exported cards contain track metadata only and state that lyrics are not included. This avoids implying that demo lyrics exist or are licensed.

## Accessibility and motion

- The full player is a named modal dialog with `aria-modal` and focus handling.
- Queue operations have explicit accessible names and visible focus states.
- Playback mode buttons expose pressed state.
- Reduced-motion and reduced-transparency preferences are respected.

## Out of scope and verification

This design pass does not add audio files or change audio rights. The approved-audio source resolver remains the gate for catalogue playback; local-file use remains session-only and requires explicit permission confirmation. Automated tests validate integration contracts and syntax. Real device/browser playback, lock-screen controls, file sharing, and touch usability still require manual checks on target browsers.
