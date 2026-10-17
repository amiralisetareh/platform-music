# STARMUSICS Design Phase 2 — Search, Explore, Artist & Album

## Intent

Continue the established white/off-white, Apple-inspired clear-glass system. This phase improves the information architecture and layout of Explore and the artist/album detail surfaces; it is not a palette reset or a product-wide redesign.

## Explore

- Three-part desktop hero: concise discovery headline, search and suggested queries, and a small abstract glass-orbit accent.
- Responsive behavior hides the decorative accent as the viewport narrows and stacks search below the heading on mobile.
- Search result cards have consistent image size, metadata hierarchy, focus states, and restrained hover feedback.
- Result-type filters remain compact pills and show result counts from the real current catalogue query.
- Genre tiles use a wider responsive grid on desktop and two columns on small screens.

## Artist and album surfaces

- The detail sheet uses a two-column editorial layout on desktop and a bottom sheet on mobile.
- Artist artwork uses a portrait crop; album artwork stays square.
- Metadata chips disclose counts and current verification state. Missing fields remain visibly absent rather than being guessed.
- Empty states explain whether artist tracks or album tracklists are not linked yet.
- Album Save remains the existing functional library action. This phase does not invent playback, biography, release dates, or tracklists.
- The overlay has dialog semantics, an accessible title/description, visible focus, Escape dismissal, and focus return to the originating control.

## Design tokens and interaction rules

- Preserve current neutral colors, translucent white surfaces, thin borders, mild blur and soft shadows.
- Motion is limited to short surface transitions; reduced-motion preferences are respected.
- Inputs and buttons retain a clear keyboard focus outline.
- The app's existing English, Russian and Persian support remains enabled; RTL layout is not replaced by this phase.

## Scope and validation

This phase modifies discovery/detail markup, a new appended design layer, entity metadata presentation, and related regression tests. It does not change the audio catalogue, licensing policy, player resolver, account API, or backend storage. Browser screenshot testing should still be run on desktop, tablet, narrow mobile, and Persian RTL before design sign-off.
