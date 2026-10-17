import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname);
const read = (path) => readFileSync(resolve(root, path), 'utf8');

function getHex(css, token) {
  const match = css.match(new RegExp(`${token}\\s*:\\s*(#[0-9a-fA-F]{6})\\b`));
  assert.ok(match, `Expected canonical color token ${token}`);
  return match[1];
}
function luminance(hex) {
  const channels = hex.slice(1).match(/.{2}/g).map((channel) => parseInt(channel, 16) / 255);
  const linear = channels.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}
function contrast(a, b) {
  const values = [luminance(a), luminance(b)].sort((left, right) => right - left);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test('Phase 6 centralizes existing design tokens and keeps feature stylesheet order stable', () => {
  const html = read('index.html');
  const tokens = read('design/tokens.css');
  const styles = read('styles.css');
  const phase1 = read('design/phase-1-home-navigation.css');
  assert.match(html, /design\/tokens\.css/);
  assert.match(html, /design\/phase-6-quality\.css/);
  const server = read('scripts/start-web.mjs');
  assert.match(server, /phase-\[1-7\]/);
  assert.match(server, /\|tokens/);
  assert.ok(html.indexOf('design/tokens.css') > html.indexOf('design/phase-5-community-backend.css'));
  assert.ok(html.indexOf('design/phase-6-quality.css') > html.indexOf('design/tokens.css'));
  for (const variable of ['--bg', '--ink', '--muted', '--muted-light', '--glass-bg', '--glass-active']) {
    assert.equal((`${styles}\n${phase1}`.match(new RegExp(`${variable}\\s*:`, 'g')) || []).length, 0, `${variable} should not be redefined in legacy layers`);
    assert.equal((tokens.match(new RegExp(`${variable}\\s*:`, 'g')) || []).length, 1, `${variable} should have one compatibility alias`);
  }
  assert.match(tokens, /--sm-space-4:\s*16px/);
  assert.match(tokens, /--sm-radius-md:\s*12px/);
  assert.match(tokens, /--sm-font-family:/);
  assert.doesNotMatch(`${styles}\n${phase1}\n${tokens}`, /\[data-theme\s*=\s*["']dark["']\s*\]/i);
});

test('canonical body and metadata colors meet WCAG AA normal text contrast against base surfaces', () => {
  const tokens = read('design/tokens.css');
  const canvas = getHex(tokens, '--sm-canvas');
  const surface = getHex(tokens, '--sm-surface');
  for (const token of ['--sm-text', '--sm-text-secondary', '--sm-text-muted', '--sm-text-subtle']) {
    const color = getHex(tokens, token);
    assert.ok(contrast(color, canvas) >= 4.5, `${token} must reach 4.5:1 against canvas`);
    assert.ok(contrast(color, surface) >= 4.5, `${token} must reach 4.5:1 against white surface`);
  }
});

test('shared quality layer supports keyboard focus, touch targets, motion, transparency and forced colors', () => {
  const css = read('design/phase-6-quality.css');
  assert.match(css, /:focus-visible[\s\S]*?outline:\s*2px solid var\(--sm-focus\)/);
  assert.match(css, /\.mobile-nav-item\s*\{[^}]*min-height:\s*44px/s);
  assert.match(css, /prefers-reduced-motion\s*:\s*reduce/);
  assert.match(css, /prefers-reduced-transparency\s*:\s*reduce/);
  assert.match(css, /forced-colors\s*:\s*active/);
  assert.match(css, /font-size:\s*14px/);
  assert.match(css, /input::placeholder[\s\S]*?opacity:\s*1/);
});

test('Phase 6 notes record the visual scope and do not claim full rendered WCAG/browser certification', () => {
  const spec = read('design/PHASE-6-CONSISTENCY-ACCESSIBILITY.md');
  const readme = read('README.md');
  const release = read('RELEASE-NOTES.md');
  assert.match(spec, /Limitations/i);
  assert.match(spec, /not a substitute/i);
  assert.match(readme, /npm run verify/);
  assert.match(release, /not a complete WCAG conformance audit/i);
});
