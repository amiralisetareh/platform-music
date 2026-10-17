import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const html = read('index.html');
const tokenCss = read('design/tokens.css');
const qualityCss = read('design/phase-6-quality.css');
const phase7Css = read('design/phase-7-page-experience.css');
const baseCss = read('styles.css');
const phase1Css = read('design/phase-1-home-navigation.css');
const allCss = [baseCss, phase1Css, read('design/phase-2-search-entity.css'), read('design/phase-3-listening-experience.css'), read('design/phase-4-community-profile.css'), read('design/phase-5-community-backend.css'), phase7Css, tokenCss, qualityCss].join('\n');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function getHex(css, token) {
  const match = css.match(new RegExp(`${token}\\s*:\\s*(#[0-9a-fA-F]{6})\\b`));
  assert(match, `Missing hex design token ${token}`);
  return match[1];
}

function luminance(hex) {
  const channels = hex.slice(1).match(/.{2}/g).map((value) => parseInt(value, 16) / 255);
  const linear = channels.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrast(a, b) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

const styleLinks = [...html.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi)].map((match) => match[1]);
const tokenIndex = styleLinks.indexOf('design/tokens.css');
const qualityIndex = styleLinks.indexOf('design/phase-6-quality.css');
assert(tokenIndex >= 0 && qualityIndex > tokenIndex, 'Phase 6 tokens and quality stylesheet must load after feature layers, with quality rules last.');
assert(styleLinks.indexOf('design/phase-5-community-backend.css') < tokenIndex, 'Canonical tokens must follow all existing feature stylesheets.');

for (const variable of ['--sm-canvas', '--sm-surface', '--sm-text', '--sm-text-secondary', '--sm-text-muted', '--sm-text-subtle', '--sm-accent', '--sm-focus', '--sm-radius-md', '--sm-space-4', '--sm-shadow-card']) {
  assert(tokenCss.includes(`${variable}:`), `Missing canonical token ${variable}`);
}

for (const legacyVariable of ['--bg', '--ink', '--muted', '--muted-light', '--glass-bg', '--glass-active']) {
  const defs = (allCss.match(new RegExp(`${legacyVariable}\\s*:`, 'g')) || []).length;
  assert(defs === 1, `Legacy compatibility token ${legacyVariable} must be defined once (found ${defs}).`);
}

assert(!/\[data-theme\s*=\s*["']dark["']\s*\]/i.test(allCss), 'Dark-theme overrides conflict with the approved light-only visual direction.');
assert(!/prefers-color-scheme\s*:\s*dark/i.test(allCss), 'System dark preference must not automatically change the approved light-only theme.');
assert(/:focus-visible[\s\S]*?outline:\s*2px solid var\(--sm-focus\)/.test(qualityCss), 'A visible focus ring must use the canonical focus token.');
assert(/prefers-reduced-motion\s*:\s*reduce/.test(qualityCss), 'Reduced-motion handling is required.');
assert(/prefers-reduced-transparency\s*:\s*reduce/.test(qualityCss), 'Reduced-transparency handling is required.');
assert(/forced-colors\s*:\s*active/.test(qualityCss), 'Forced-colors handling is required.');
assert(/\.mobile-nav-item\s*\{[^}]*min-height:\s*44px/s.test(qualityCss), 'Mobile navigation touch targets must be at least 44px tall.');
assert(/font-size:\s*14px/.test(qualityCss), 'The base text scale should be 14px.');

const canvas = getHex(tokenCss, '--sm-canvas');
const surface = getHex(tokenCss, '--sm-surface');
for (const token of ['--sm-text', '--sm-text-secondary', '--sm-text-muted', '--sm-text-subtle']) {
  const colour = getHex(tokenCss, token);
  const canvasRatio = contrast(colour, canvas);
  const surfaceRatio = contrast(colour, surface);
  assert(canvasRatio >= 4.5 && surfaceRatio >= 4.5, `${token} fails 4.5:1 contrast: canvas ${canvasRatio.toFixed(2)}, surface ${surfaceRatio.toFixed(2)}.`);
  process.stdout.write(`Contrast OK: ${token} ${canvasRatio.toFixed(2)}:1 on canvas, ${surfaceRatio.toFixed(2)}:1 on white\n`);
}

process.stdout.write('Design-system audit passed: canonical tokens, light-only theme, readable base scale, focus states, motion/transparency/forced-colors support, and mobile targets.\n');
