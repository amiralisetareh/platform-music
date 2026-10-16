# STARMUSICS — Music, with intention.

A static, responsive frontend prototype. It implements a premium Apple-inspired glass visual system with white/off-white surfaces, translucent panels, restrained red accents, icon-only desktop navigation rail, full localization (EN/RU/FA + RTL), and a three-mode cinematic player sharing a single HTML audio engine.

## Run locally

Requires Node.js only for the optional smoke tests. The app itself has no build step or runtime dependencies.

```sh
python3 -m http.server 8080
```

Open `http://localhost:8080`.

Run the static regression checks:

```sh
npm test
```

## Current implementation

- Responsive home, explore, library, playlists, artists, albums, genres, recently played, profile and discussions views.
- Five-item mobile bottom navigation alongside desktop navigation: Home, Explore, Artists, Discussions, and Profile. Library and playlist management are accessed from Profile rather than dedicated left-navigation tabs.
- Light monochrome glass UI; no dark-theme toggle or visual redesign.
- Player stays hidden until a track is selected. A shared HTML audio engine drives playback state, seeking, volume and progress; sample catalogue entries require a permitted local audio file or a valid audio URL.
- Client-side search across the sample catalogue.
- Local-browser liked-track state, recent-play history, playlist creation/deletion, profile display name and biography, and basic achievement progress. Personal playlists support opening a detail view, adding/removing catalogue tracks, and queue-based playback.
- Discussion topic selection, local comments, selected-topic heading, and reply-count updates for comments stored in this browser.
- Keyboard controls for progress and volume sliders.
- Defensive parsing of browser-stored profile, playlist, comment and liked-track data.
- Node's built-in test runner checks JavaScript syntax, core page structure, unique IDs, localization hooks, detail-sheet wiring and key feature hooks. These are smoke tests, not full browser automation.

## Important limitations

This is a **frontend prototype**, not a production-ready multi-user music platform. It has no backend, real authentication, shared database, server-side authorization, secure audio uploads, cross-device sync, moderation system or trusted trophy awarding. Browser storage is user-controlled and must never be treated as trusted data. Comments and profile information are stored only in the current browser and are not shared with other listeners.

No licensed music catalogue is bundled. The player uses the browser audio engine, but tracks need a valid audio source; a local file can be selected for a session. Before enabling uploads or public streaming, implement file validation, rights declarations, moderation, storage controls and server-side authorization. Do not hotlink copyrighted music without permission.

## Manual verification checklist

- Open the app through the local HTTP server and navigate through each page.
- Check desktop sidebar and five-item mobile navigation at narrow viewport widths.
- Confirm the player is hidden on initial load and appears only after selecting a sample track.
- Like a track, navigate to Library, and verify it remains listed after switching tracks and refreshing.
- Create a playlist; open it; add a catalogue track; verify the track appears and the Add button changes to Added. Remove a track, then use Play all and confirm the queue advances in playlist order. Refresh and verify playlist contents persist. Delete the playlist and verify it disappears from Library and Profile.
- Edit the profile display name and biography; verify the saved values persist after refresh.
- Select discussion topics, add a comment, and verify the heading and local reply counts update.
- Use arrow keys, Home and End on the player progress and volume sliders.
- Run `npm test` after changes.

## Localization and discovery detail sheets

The header language menu offers English, Russian and Persian, remembers the selected language, and switches the document to RTL for Persian. Core navigation and common interface labels are translated; this is an incremental client-side dictionary, not yet a complete professional localization pass for every generated label, error message and catalogue description. Artist and genre cards open editorial detail sheets with related discovery and selectable tracks. Album cards open album detail sheets. The catalogue and related track data remain sample content rather than a licensed metadata feed.

## Production gaps

A production launch still requires a backend and database, real account ownership, role-based admin permissions, server-validated achievements, audio storage and delivery, moderation/reporting, privacy controls, backups, observability and multi-account security testing. Choose infrastructure only after verifying that it is accessible and commercially suitable for the intended users.

## Cinematic glass player update

The player now offers three presentation modes: **Dock**, **Page**, and **Mini**. The selected mode is remembered in this browser. All modes use the same HTML audio engine and queue, with real play/pause, seeking, volume, and playback progress. The player stays hidden until a track is selected.

The current catalogue is illustrative and does not include licensed audio files. Select a track, open the player, and use **Choose audio file** to play a local audio file you have permission to use. Audio selected from your device is temporary for this browser session; it is not uploaded to a server. The mini mode is a floating in-site player, not an operating-system Home Screen widget. A true Home Screen widget requires platform-specific app/widget integration.

The lyrics area includes a sharing action for track-card text and a rights reminder. It intentionally does not fabricate or bundle copyrighted lyrics. Add original or properly licensed lyric text and timestamps before enabling synced lyrics or lyric-card sharing.


## Latest interaction refinement

- Removed the Library and Playlists destinations from the left navigation; icon-only glass shortcuts for liked songs, recent listening, albums, and playlists are inside Profile. Playlist creation and editing remain available there.
- Reworked the floating mini-player so it is fixed on desktop and mobile, with Play/Pause, Return to previous mode, and Expand controls.
- Reworked full-page playback into an editorial split layout with ambient cover-art lighting, art sheen, a playback-only visualizer, smooth mode transitions, and reduced-motion support.
- Consolidated duplicate modal handlers and hardened the language menu interaction for pointer, keyboard, and outside-click dismissal. English, Russian, and Persian switches update language and Persian sets RTL direction.

### Navigation/player refinement

- The desktop sidebar no longer shows Library or Playlists destinations. Collection shortcuts are icon-only glass controls in Profile; playlist management remains available in Profile.
- The top-right profile control is now a pale glass icon rather than a dark blank circle. The language globe remains visible on mobile as well as desktop.
- Mini-player controls include Return to previous mode, Play/Pause, and Expand. Full-player transitions use the same audio state and queue, with artwork sheen/ambient drift and a playing-state visualizer. Mobile retains an accessible player-mode control.
- The language switcher persists its choice across navigation and refresh, and Persian sets RTL. This remains a partial localization, not a finished translation of every generated label.


## Navigation/player correction

- Library is not a primary sidebar destination; collection shortcuts are inside Profile.
- Removed the playlist shortcut from the Profile icon hub and removed the standalone Playlists view from the UI.
- Language selection is icon-only and supports English, Russian, and Persian with RTL for Persian.
- Player modes: dock, full-page, and mini; the mode control returns from mini to the previous full view.
- Cinematic motion uses restrained transitions and respects reduced-motion preferences.

The catalogue remains a frontend prototype. Shared accounts/community data and a licensed catalogue require a backend and content rights.


## Icon-rail navigation update

The desktop/tablet sidebar now follows the supplied reference: a narrow, icon-only vertical rail with clear glass surfaces, rounded icon tiles, subtle lift transitions, and a red active-state accent. Profile is included in the rail. Accessible labels and titles remain available for screen readers and hover tooltips. On mobile, the existing bottom navigation remains the primary navigation.


## Full-page layout correction

The app now fills the full viewport at desktop, tablet, and mobile sizes. The inset rounded outer card, outer margin, decorative background frame, and outer shadow have been removed. The icon-only glass navigation remains inside the full-page layout.

## Delivery summary (this archive)

**What was verified and retained**

- Full-viewport layout (no outer inset card or decorative frame).
- Narrow icon-only glass navigation rail (Home, Explore, Artists, Albums, Genres, Discussions, Profile) with red active state, tooltips, and accessible names. Library and Playlists removed from primary nav; collections live under Profile.
- Mobile bottom navigation with five items and safe-area awareness.
- Working search, language selector (EN / RU / FA) with immediate UI update, localStorage persistence, and full RTL layout for Persian.
- Shared player state across dock / full-page / mini modes; real `<audio>` element; seek, volume, queue, shuffle/repeat hooks; mini-player restore never traps the user.
- Home discovery sections, artist/album/genre detail sheets, profile collections, local discussions prototype, liked tracks, history, playlists.
- Reduced-motion support, keyboard focus, semantic structure.
- Smoke tests (Node test runner) covering syntax, unique IDs, navigation, player modes, localization hooks, and detail wiring.

**Test results (executed)**

```
✔ application JavaScript parses successfully
✔ HTML has unique IDs and its local assets exist
✔ core views and profile editing controls are present
✔ discussion and liked-track regressions are covered by implementation hooks
✔ mobile navigation and light glass styling remain available
✔ playlist builder supports detail, add/remove, and ordered playback hooks
✔ cinematic player supports three modes and uses a real audio element
✔ language menu includes English, Russian and Persian with RTL support hook
✔ artist, album and genre discovery detail sheets are wired
✔ mobile retains working language and player-mode controls
ℹ tests 10  pass 10  fail 0
```

**Known limitations / remaining work**

- No backend, authentication, shared persistence, or real multi-user discussions. All personal data is browser-local only.
- Catalogue is sample/illustrative; no licensed audio is bundled. Users must supply a local audio file (or a permitted URL) to hear playback.
- Localization is a functional client-side dictionary covering core UI strings; not a professional translation of every generated or dynamic label.
- Lyrics panel is present but does not ship copyrighted timed lyrics.
- Notifications control is visual only (no real notification system).
- Achievements are local progress indicators, not server-validated.

**How to run**

```sh
python3 -m http.server 8080
# open http://localhost:8080
npm test
```

