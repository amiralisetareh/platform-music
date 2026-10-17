import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname);
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
const js = readFileSync(resolve(root, 'app.js'), 'utf8');
const css = readFileSync(resolve(root, 'design/phase-4-community-profile.css'), 'utf8');
const packageData = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));

test('v0.8.7 links a dedicated Phase 4 community/profile design layer', () => {
  assert.equal(packageData.version, '0.9.0');
  assert.match(html, /href="design\/phase-4-community-profile\.css"/);
  assert.match(css, /white\/off-white glass surfaces/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /prefers-reduced-transparency: reduce/);
});

test('discussion topics include searchable filters and accessible sort states', () => {
  assert.match(html, /id="discussion-search"/);
  assert.match(html, /data-discussion-sort="active" aria-pressed="true"/);
  assert.match(html, /data-discussion-sort="latest"/);
  assert.match(html, /data-discussion-sort="all"/);
  assert.match(html, /id="discussion-list-empty" hidden/);
  assert.match(js, /let discussionSearchQuery = ''/);
  assert.match(js, /function renderDiscussionPage\(\)/);
  assert.match(js, /topics\.sort\(\(a,b\) => discussionCount\(b\.index\) - discussionCount\(a\.index\)\)/);
});

test('comments show an author, timestamp, local reaction and empty state safely', () => {
  assert.match(html, /id="comments-list" aria-live="polite"/);
  assert.match(html, /id="comment-composer-avatar"/);
  assert.match(js, /author: typeof c\.author === 'string'/);
  assert.match(js, /function formatCommentTime\(/);
  assert.match(js, /data-like-comment=/);
  assert.match(js, /saveLocal\('starmusics\.comments', localCommunityComments\)/);
  assert.match(js, /Comment saved on this device/);
  assert.match(js, /escapeHTML\(comment\.text\)/);
  assert.match(js, /discussion-empty-state/);
});

test('profile metrics and milestones are derived from local activity', () => {
  for (const id of ['profile-avatar-initials', 'profile-stat-liked', 'profile-stat-playlists', 'profile-stat-comments', 'profile-stat-albums']) assert.match(html, new RegExp(`id="${id}"`));
  assert.match(js, /function renderProfileStats\(/);
  assert.match(js, /function profileInitials\(/);
  assert.match(js, /title:'Conversation starter'/);
  assert.match(js, /title:'Community regular'/);
  assert.match(js, /title:'Album archivist'/);
  assert.match(css, /\.profile-stats/);
  assert.match(css, /\.achievement\.is-earned/);
});

test('release documentation is explicit about local-only community data and authorization gaps', () => {
  const notes = readFileSync(resolve(root, 'PHASE-4-NOTES.md'), 'utf8');
  assert.match(notes, /stored in this browser only/i);
  assert.match(notes, /server-side owner authorization/i);
  assert.match(notes, /Browser-level visual testing is still required/i);
});
