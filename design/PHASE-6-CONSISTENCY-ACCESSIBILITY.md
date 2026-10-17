# Phase 6 — Design Consistency, Accessibility & Visual QA

## Goal

Make the existing light Apple-inspired clear-glass interface more consistent, readable and accessible without changing its established visual direction or replacing its layout.

## Implemented

- Moved canonical color, typography, spacing, radius, shadow and glass values into `design/tokens.css`.
- Kept compatibility aliases for the established components so the CSS refactor does not require a full component rewrite.
- Removed duplicated root token declarations from `styles.css` and the token-only block from the Phase 1 stylesheet. The older unused dark-theme declaration has also been removed to preserve the agreed light-only direction.
- Added `design/phase-6-quality.css` as the final shared quality layer for base typography, meaningful metadata, placeholders, focus states, common control target sizes, reduced motion, reduced transparency, forced colors, and narrow mobile layouts.
- Added `scripts/audit-design-system.mjs` and included it in `npm run verify`.
- Added regression tests for token centralization, contrast thresholds, accessibility preferences and CSS load order.

## Design system contracts

- The canonical values live in `design/tokens.css`; new CSS should use the `--sm-*` tokens.
- Legacy variable names are compatibility aliases and should not receive additional definitions in feature stylesheets.
- The app remains light-only. Do not reintroduce a dark palette or system-driven automatic theme switching without a deliberate product decision.
- Glass effects should remain selective. Prefer one shared surface token over bespoke blur and shadow values on every nested element.
- Body copy is 14px minimum by default; nonessential editorial labels may remain compact. Meaningful metadata is normalized to 12px or larger by the quality layer.
- The canonical text and metadata colors must meet WCAG AA's 4.5:1 normal-text contrast ratio against the base canvas and white surface. These checks validate token colors, not every possible rendered composition.
- Keyboard focus, reduced-motion, reduced-transparency and forced-colors behavior are shared system requirements.

## Verification

The final `npm run verify` run passed with 76 tests and no failures. Catalogue/schema and audio-rights audits passed; all 8 CSS files passed structural checks; and the design-system audit measured canonical text colors at 4.57:1–13.51:1 against the base canvas and 4.94:1–14.60:1 against white. A headless Chromium screenshot attempt timed out before producing a screenshot, so visual QA is not marked complete.

Run `npm run verify` to reproduce the checks: catalogue generation and audits, audio-rights audit, design-system audit, JavaScript syntax checks, CSS structural checks, and the full automated test suite. The design audit calculates contrast ratios directly from canonical token values and checks that the final stylesheet order and accessibility preference hooks remain present.

## Limitations

This phase is a systematic CSS/token cleanup and accessibility foundation, not a complete browser/device certification. Automated tests and token calculations are not a substitute for manual accessibility and rendered visual QA. Some legacy component rules remain in the feature stylesheets for compatibility; future component work should migrate remaining hard-coded visual values to the token system incrementally. Token-level contrast checks cannot validate translucent compositing, images, every hover/active state, or dynamically rendered text against every background. Manual keyboard, zoom, localization/RTL, real-browser responsive and assistive-technology QA are still required before a public launch.
