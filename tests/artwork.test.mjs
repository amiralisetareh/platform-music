import test from 'node:test';
import assert from 'node:assert/strict';
import '../artwork-fallback.js';

const artwork = globalThis.STARMUSICS_ArtworkFallback;

test('artwork fallback generates local self-contained SVG data URIs', () => {
  assert.ok(artwork, 'fallback utility should be available');
  const uri = artwork.toDataUri('Frank Ocean');
  assert.match(uri, /^data:image\/svg\+xml;charset=UTF-8,/);
  const svg = decodeURIComponent(uri.slice(uri.indexOf(',') + 1));
  assert.match(svg, /<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
  assert.match(svg, /STARMUSICS/);
  assert.doesNotMatch(svg, /images\.unsplash\.com|<image\s/i);
});

test('artwork fallback safely escapes characters and varies its palette by label', () => {
  const hostile = decodeURIComponent(artwork.toDataUri('<script>alert(1)</script>').split(',')[1]);
  assert.doesNotMatch(hostile, /<script>/i);
  assert.match(hostile, /&lt;/);
  assert.notEqual(artwork.toDataUri('Kendrick Lamar'), artwork.toDataUri('Frank Ocean'));
});
