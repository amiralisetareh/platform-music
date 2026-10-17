# STARMUSICS Design Phase 1 — Home & Global Navigation

## Intent

Refine the existing Home and navigation system into a more coherent editorial music experience while preserving the current light/off-white clear-glass visual language. This is a focused layer over the existing application, not a rewrite and not a dark-theme redesign.

## Implemented

- Refined the light canvas toward off-white with restrained blue/lilac ambient color.
- Standardized the desktop icon rail's logo tile, icon scale, active state, hover feedback, and tooltip surfaces.
- Added Discussions to the desktop navigation rail so the community area is a first-class destination.
- Refined toolbar search, language selector, and quiet utility controls.
- Refined Home's featured collection, genre shortcuts, section hierarchy, album cards, artist interactions, and discussion previews.
- Kept the right-hand trending/discussion rail as supporting content, not a competing headline.
- Standardized mobile bottom navigation spacing, icon sizing, touch targets, safe-area spacing, and player clearance.
- Added visible keyboard focus styles and reduced-motion/reduced-transparency behavior.
- Left playback logic, account behavior, seed content, and rights validation unchanged.

## Design tokens

| Token | Value / role |
|---|---|
| Canvas | `#F5F6F9` with subtle ambient gradients |
| Primary text | `#222936` |
| Secondary text | `#4F596B` |
| Muted text | `#737F91` |
| Glass surfaces | White at roughly 22–90% opacity, depending on hierarchy |
| Borders | Fine white translucent borders, up to about 0.9 opacity |
| Shadows | Low-contrast cool gray; inset highlight plus restrained outer shadow |
| Accent | Slate/graphite (`#303949`) rather than neon |
| Shape language | 14–27 px card radii; pill shapes reserved for compact actions |
| Motion | Short 180–200 ms interactions; removed for reduced-motion preference |

## Reference image

`references/home-and-navigation-concept.png` is an AI-generated direction board for composition and visual tone. Names, covers, labels, screen content, and token values shown inside that image are illustrative and are not authoritative catalogue data. The actual interface continues to use its real demo seed until metadata has been verified.

## Verification

Run `npm run verify` for catalogue generation/audits, syntax checks, and the automated Node test suite. This release has not been visually browser-tested in a real browser in this environment; the manual checklist in `README.md` remains required before accepting the UI as final.
