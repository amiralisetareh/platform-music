import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

let proc, base, dir;
const setupToken = 'starmusics-owner-setup-token-for-test-only-0123456789';
async function start() {
  dir = await mkdtemp(path.join(os.tmpdir(), 'starmusics-community-'));
  const port = 20000 + Math.floor(Math.random() * 20000);
  base = `http://127.0.0.1:${port}`;
  proc = spawn(process.execPath, ['server/start.mjs'], {
    cwd: path.resolve(''),
    env: { ...process.env, PORT: String(port), STARMUSICS_DATA_DIR: dir, PUBLIC_ORIGIN: base, STARMUSICS_OWNER_SETUP_TOKEN: setupToken },
    stdio: 'ignore'
  });
  for (let i = 0; i < 80; i += 1) {
    try { const response = await fetch(`${base}/api/health`); if (response.ok) return; } catch {}
    await delay(100);
  }
  throw new Error('Community API failed to start');
}
async function stop() {
  proc?.kill('SIGTERM');
  await delay(180);
  if (dir) await rm(dir, { recursive: true, force: true });
}
async function request(route, { method='GET', cookie='', body, origin=base } = {}) {
  const headers = {};
  if (origin !== undefined && origin !== null) headers.origin = origin;
  if (cookie) headers.cookie = cookie;
  if (body !== undefined) headers['content-type'] = 'application/json';
  const response = await fetch(`${base}${route}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  let data = {};
  try { data = await response.json(); } catch {}
  return { response, data };
}
async function register(email) {
  const { response, data } = await request('/api/register', { method:'POST', body:{ email, password:'long-community-password-123' } });
  assert.equal(response.status,201,JSON.stringify(data));
  return { cookie:response.headers.get('set-cookie').split(';')[0], user:data.user };
}

test('Phase 5 community endpoints persist comments, reactions and public-safe member profiles', async t => {
  await start(); t.after(stop);
  let { response, data } = await request('/api/community/status');
  assert.equal(response.status,200);
  assert.equal(data.enabled,true);
  assert.equal(data.ownerClaimAvailable,true);

  ({ response, data } = await request('/api/community/topics'));
  assert.equal(response.status,200);
  assert.ok(data.topics.length >= 4);
  assert.equal(data.topics[0].commentCount,0,'seeded reply metadata is not misrepresented as live comments');
  const topic = data.topics[0];

  ({ response } = await request(`/api/community/topics/${topic.id}/comments`, { method:'POST', body:{text:'An unauthenticated comment'} }));
  assert.equal(response.status,401);

  const first = await register('listener-one@example.com');
  const second = await register('listener-two@example.com');
  ({ response, data } = await request(`/api/community/topics/${topic.id}/comments`, { method:'POST', cookie:first.cookie, body:{text:'A useful music discussion comment.'} }));
  assert.equal(response.status,201,JSON.stringify(data));
  const comment = data.comment;
  assert.equal(comment.text,'A useful music discussion comment.');
  assert.equal(comment.isMine,true);
  assert.equal(comment.likesCount,0);

  ({ response, data } = await request(`/api/community/members/${first.user.id}`));
  assert.equal(response.status,200);
  assert.equal(data.member.name,'Listener');
  assert.equal(data.member.commentCount,1);
  assert.equal('email' in data.member,false,'public member payload must not expose email');

  ({ response } = await request(`/api/community/comments/${comment.id}/like`, { method:'POST', body:{liked:true} }));
  assert.equal(response.status,401);
  ({ response, data } = await request(`/api/community/comments/${comment.id}/like`, { method:'POST', cookie:second.cookie, body:{liked:true} }));
  assert.equal(response.status,200);
  assert.equal(data.likesCount,1);
  assert.equal(data.liked,true);
  ({ response, data } = await request(`/api/community/topics/${topic.id}/comments`, { cookie:second.cookie }));
  assert.equal(response.status,200);
  assert.equal(data.comments[0].liked,true);
  assert.equal(data.comments[0].author,'Listener');
  assert.equal(JSON.stringify(data).includes('listener-one@example.com'),false);

  ({ response, data } = await request(`/api/community/comments/${comment.id}/report`, { method:'POST', cookie:second.cookie, body:{reason:'spam',details:'This is a test report.'} }));
  assert.equal(response.status,201,JSON.stringify(data));
  ({ response, data } = await request(`/api/community/comments/${comment.id}/report`, { method:'POST', cookie:second.cookie, body:{reason:'spam'} }));
  assert.equal(response.status,409,'each member can report a comment only once');

  ({ response } = await request('/api/community/topics', { method:'POST', cookie:first.cookie, body:{title:'Unauthorized topic',description:''} }));
  assert.equal(response.status,403,'ordinary members cannot create curated topics');
});

test('owner claim is one-time, topic creation is owner-only, and moderation is auditable', async t => {
  await start(); t.after(stop);
  const owner = await register('operator@example.com');
  const moderator = await register('moderator@example.com');
  const member = await register('member@example.com');
  let { response, data } = await request('/api/community/owner/claim', { method:'POST', cookie:owner.cookie, body:{token:'not-the-secret-at-all-0123456789'} });
  assert.equal(response.status,403);
  ({ response, data } = await request('/api/community/owner/claim', { method:'POST', cookie:owner.cookie, body:{token:setupToken} }));
  assert.equal(response.status,200,JSON.stringify(data));
  assert.equal(data.user.communityRole,'owner');
  ({ response } = await request('/api/community/owner/claim', { method:'POST', cookie:moderator.cookie, body:{token:setupToken} }));
  assert.equal(response.status,403,'a second account cannot claim owner role');

  ({ response } = await request('/api/community/topics', { method:'POST', cookie:owner.cookie, body:{title:'Fresh listening thread',description:'A curated topic created by the site owner.'} }));
  assert.equal(response.status,201);
  const createdTopics = await request('/api/community/topics');
  const customTopic = createdTopics.data.topics.find(topic => topic.title==='Fresh listening thread');
  assert.ok(customTopic);
  const posted = await request(`/api/community/topics/${customTopic.id}/comments`, { method:'POST', cookie:member.cookie, body:{text:'Please review this comment.'} });
  assert.equal(posted.response.status,201);
  const commentId=posted.data.comment.id;
  const report = await request(`/api/community/comments/${commentId}/report`, { method:'POST', cookie:moderator.cookie, body:{reason:'harassment',details:'Flagged for review'} });
  assert.equal(report.response.status,201);

  ({ response, data } = await request(`/api/community/members/${moderator.user.id}/role`, { method:'PUT', cookie:owner.cookie, body:{role:'moderator'} }));
  assert.equal(response.status,200);
  assert.equal(data.member.role,'moderator');
  ({ response, data } = await request('/api/community/reports', { cookie:moderator.cookie }));
  assert.equal(response.status,200);
  assert.equal(data.reports.length,1);
  assert.equal(data.reports[0].commentText,'Please review this comment.');
  assert.equal(JSON.stringify(data).includes('member@example.com'),false,'moderation report payload must not reveal reporter or author emails');

  ({ response, data } = await request(`/api/community/comments/${commentId}`, { method:'PATCH', cookie:moderator.cookie, body:{action:'hide',reason:'Confirmed rule violation'} }));
  assert.equal(response.status,200);
  assert.equal(data.status,'hidden');
  ({ response, data } = await request(`/api/community/topics/${customTopic.id}/comments`));
  assert.equal(response.status,200);
  assert.equal(data.comments.length,0,'hidden comments must disappear from public reads');
  ({ response } = await request(`/api/community/reports/${report.data.reportId}`, { method:'PATCH', cookie:moderator.cookie, body:{status:'closed',moderatorNote:'Resolved'} }));
  assert.equal(response.status,200);
  ({ response, data } = await request('/api/community/reports', { cookie:member.cookie }));
  assert.equal(response.status,403,'ordinary members cannot read private reports');
  ({ response, data } = await request('/api/community/reports', { cookie:moderator.cookie }));
  assert.equal(response.status,200);
  assert.equal(data.reports[0].status,'closed');

  ({ response } = await request(`/api/community/comments/${commentId}`, { method:'PATCH', cookie:member.cookie, body:{action:'restore'} }));
  assert.equal(response.status,403,'ordinary members cannot moderate their own comments');
});

test('community write endpoints enforce origin, content limits, and authorization', async t => {
  await start(); t.after(stop);
  const member=await register('origin-check@example.com');
  let { response }=await request('/api/community/topics', { method:'POST', cookie:member.cookie, body:{title:'Not allowed cross-origin'}, origin:'https://attacker.invalid' });
  assert.equal(response.status,403);
  ({ response }=await request('/api/community/topics', { method:'POST', cookie:member.cookie, body:{title:'Missing origin'}, origin:null }));
  assert.equal(response.status,403);
  const { data:topicData }=await request('/api/community/topics');
  const topic=topicData.topics[0];
  ({ response }=await request(`/api/community/topics/${topic.id}/comments`, { method:'POST', cookie:member.cookie, body:{text:'x'.repeat(801)} }));
  assert.equal(response.status,400);
  ({ response }=await request(`/api/community/comments/${'0'.repeat(32)}/like`, { method:'POST', cookie:member.cookie, body:{liked:'yes'} }));
  assert.equal(response.status,400);
});


test('consolidated community UI wires shared status, owner setup, reporting, moderation, and role management', async () => {
  const [html, app] = await Promise.all([readFile('index.html', 'utf8'), readFile('app.js', 'utf8')]);
  for (const id of ['community-source-label','community-composer-note','community-moderation-panel','community-topic-create-form','owner-claim-panel','report-form','public-profile-dialog','btn-toggle-member-moderator']) assert.match(html, new RegExp(`id=\"${id}\"`), `${id} should exist in the page`);
  assert.match(app, /initializeCommunityBackend\(\)/);
  assert.match(app, /community\/owner\/claim/);
  assert.match(app, /community\/members\/\$\{encodeURIComponent\(memberId\)\}\/role/);
  assert.match(app, /data-resolve-report/);
  assert.match(html, /phase-5-community-backend\.css/);
});
