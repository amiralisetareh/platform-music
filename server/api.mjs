import http from 'node:http';
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { readFile, mkdir, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const scrypt = promisify(scryptCallback);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = path.resolve(process.env.STARMUSICS_DATA_DIR || path.join(ROOT, '..', 'starmusics-private-data'));
const DB_FILE = path.join(DATA_DIR, 'starmusics.sqlite');
const LEGACY_DB_FILE = path.join(DATA_DIR, 'accounts.json');
const PROD = process.env.NODE_ENV === 'production';
const ORIGIN = process.env.PUBLIC_ORIGIN || 'http://127.0.0.1:8080';
let sqlite;
const sessionHash = sid => createHash('sha256').update(String(sid)).digest('hex');
function saveSession(sid, userId) { sqlite.prepare('INSERT OR REPLACE INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)').run(sessionHash(sid), userId, Date.now() + 7 * 86400_000); }
function deleteSession(sid) { if (sid) sqlite.prepare('DELETE FROM sessions WHERE token_hash=?').run(sessionHash(sid)); }
function sessionUserId(sid) { if (!sid) return null; const row = sqlite.prepare('SELECT user_id, expires_at FROM sessions WHERE token_hash=?').get(sessionHash(sid)); if (!row) return null; if (row.expires_at <= Date.now()) { deleteSession(sid); return null; } return row.user_id; }
const authAttempts = new Map();
const MAX_BODY = 64 * 1024;
const AUTH_WINDOW_MS = 60_000;
const AUTH_ATTEMPT_LIMIT = 10;
const COMMUNITY_LIMIT = 12;
const communityAttempts = new Map();
let db = { users: [] };
async function loadDb() {
  await mkdir(DATA_DIR, { recursive: true });
  sqlite = new DatabaseSync(DB_FILE);
  sqlite.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;');
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, data_json TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires_at INTEGER NOT NULL);
    CREATE INDEX IF NOT EXISTS sessions_expiry_idx ON sessions(expires_at);
    CREATE TABLE IF NOT EXISTS community_roles (user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE, role TEXT NOT NULL CHECK(role IN ('owner','moderator')), granted_by TEXT REFERENCES users(id), created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS community_topics (id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL DEFAULT '', created_by TEXT REFERENCES users(id), created_at TEXT NOT NULL, updated_at TEXT NOT NULL, is_seeded INTEGER NOT NULL DEFAULT 0, sort_order INTEGER NOT NULL DEFAULT 0, is_open INTEGER NOT NULL DEFAULT 1);
    CREATE TABLE IF NOT EXISTS community_comments (id TEXT PRIMARY KEY, topic_id TEXT NOT NULL REFERENCES community_topics(id), user_id TEXT NOT NULL REFERENCES users(id), body TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'visible' CHECK(status IN ('visible','hidden')), created_at TEXT NOT NULL, updated_at TEXT NOT NULL, hidden_by TEXT REFERENCES users(id), hidden_reason TEXT);
    CREATE INDEX IF NOT EXISTS community_comments_topic_idx ON community_comments(topic_id, status, created_at);
    CREATE INDEX IF NOT EXISTS community_comments_user_idx ON community_comments(user_id, status);
    CREATE TABLE IF NOT EXISTS community_comment_likes (comment_id TEXT NOT NULL REFERENCES community_comments(id) ON DELETE CASCADE, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, created_at TEXT NOT NULL, PRIMARY KEY(comment_id,user_id));
    CREATE TABLE IF NOT EXISTS community_reports (id TEXT PRIMARY KEY, comment_id TEXT NOT NULL REFERENCES community_comments(id), reporter_id TEXT NOT NULL REFERENCES users(id), reason TEXT NOT NULL, details TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open','reviewed','closed')), created_at TEXT NOT NULL, resolved_by TEXT REFERENCES users(id), resolved_at TEXT, moderator_note TEXT NOT NULL DEFAULT '', UNIQUE(comment_id,reporter_id));
    CREATE INDEX IF NOT EXISTS community_reports_status_idx ON community_reports(status,created_at);
    CREATE TABLE IF NOT EXISTS community_audit_log (id TEXT PRIMARY KEY, actor_id TEXT NOT NULL REFERENCES users(id), action TEXT NOT NULL, subject_type TEXT NOT NULL, subject_id TEXT NOT NULL, metadata_json TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL);
    CREATE INDEX IF NOT EXISTS community_audit_log_created_idx ON community_audit_log(created_at);
    CREATE TABLE IF NOT EXISTS app_meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);
  `);
  const existing = sqlite.prepare('SELECT COUNT(*) AS n FROM users').get().n;
  if (!existing) {
    try {
      await access(LEGACY_DB_FILE);
      const legacy = JSON.parse(await readFile(LEGACY_DB_FILE, 'utf8'));
      if (!Array.isArray(legacy.users)) throw new Error('invalid legacy store');
      const insert = sqlite.prepare('INSERT INTO users(id,email,data_json) VALUES(?,?,?)');
      sqlite.exec('BEGIN IMMEDIATE');
      try { for (const user of legacy.users) insert.run(user.id, user.email, JSON.stringify(user)); sqlite.exec('COMMIT'); } catch (error) { sqlite.exec('ROLLBACK'); throw error; }
      await import('node:fs/promises').then(fs => fs.rename(LEGACY_DB_FILE, `${LEGACY_DB_FILE}.migrated`));
    } catch (error) { if (error.code !== 'ENOENT') throw new Error('Legacy account database could not be migrated safely.'); }
  }
  db.users = sqlite.prepare('SELECT data_json FROM users').all().map(row => JSON.parse(row.data_json));
  sqlite.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(Date.now());
  await seedCommunityTopics();
}
async function persist() {
  if (!sqlite) throw new Error('Account database has not been initialized');
  const upsert = sqlite.prepare('INSERT INTO users(id,email,data_json) VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET email=excluded.email,data_json=excluded.data_json');
  const ids = new Set(db.users.map(user => user.id));
  sqlite.exec('BEGIN IMMEDIATE');
  try {
    for (const user of db.users) upsert.run(user.id, user.email, JSON.stringify(user));
    const existing = sqlite.prepare('SELECT id FROM users').all();
    const remove = sqlite.prepare('DELETE FROM users WHERE id=?');
    for (const row of existing) if (!ids.has(row.id)) remove.run(row.id);
    sqlite.exec('COMMIT');
  } catch (error) { sqlite.exec('ROLLBACK'); throw error; }
}
const json = (res, status, value, headers={}) => { const securityHeaders = { 'content-type':'application/json; charset=utf-8', 'cache-control':'no-store', 'x-content-type-options':'nosniff', 'x-frame-options':'DENY', 'referrer-policy':'no-referrer', 'permissions-policy':'camera=(), microphone=(), geolocation=()', 'access-control-allow-origin':ORIGIN, 'access-control-allow-credentials':'true', 'vary':'Origin' }; if (PROD) securityHeaders['strict-transport-security'] = 'max-age=31536000; includeSubDomains'; res.writeHead(status, { ...securityHeaders, ...headers }); res.end(JSON.stringify(value)); };
function authRateLimited(req, route) {
  const now = Date.now();
  const key = `${req.socket.remoteAddress || 'unknown'}:${route}`;
  const current = authAttempts.get(key);
  if (!current || current.start + AUTH_WINDOW_MS <= now) { authAttempts.set(key, { start: now, count: 1 }); return false; }
  current.count += 1;
  if (authAttempts.size > 5000) for (const [k, v] of authAttempts) if (v.start + AUTH_WINDOW_MS <= now) authAttempts.delete(k);
  return current.count > AUTH_ATTEMPT_LIMIT;
}
async function body(req) { let s=''; for await (const chunk of req) { s += chunk; if (Buffer.byteLength(s) > MAX_BODY) throw Object.assign(new Error('Request too large'), {status:413}); } try { return s ? JSON.parse(s) : {}; } catch { throw Object.assign(new Error('Invalid JSON'), {status:400}); } }
function cookie(req, name) { const part=(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith(name+'=')); return part ? decodeURIComponent(part.slice(name.length+1)) : ''; }
function safeUser(u) { return { id:u.id, email:u.email, profile:u.profile, library:u.library, createdAt:u.createdAt, communityRole:communityRole(u.id) }; }
function current(req) { const sid=cookie(req,'starmusics_session'); const uid=sessionUserId(sid); return db.users.find(u=>u.id===uid); }
function sessionCookie(sid, maxAge=60*60*24*7) { return `starmusics_session=${encodeURIComponent(sid)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${PROD?'; Secure':''}`; }
function validOrigin(req) { const origin=req.headers.origin; return !origin || origin === ORIGIN; }
function validWriteOrigin(req) { return typeof req.headers.origin === 'string' && req.headers.origin === ORIGIN; }
function cleanProfile(p={}) { return { name: String(p.name||'Listener').trim().slice(0,32)||'Listener', bio:String(p.bio||'').trim().slice(0,180) }; }
function cleanTrack(t={}) {
  if (!t || typeof t !== 'object') return null;
  const id = String(t.id || '').trim().slice(0,120);
  const title = String(t.title || t.track || '').trim().slice(0,120);
  if (!id || !title) return null;
  const artist = String(t.artist || t.subtitle || 'Unknown artist').trim().slice(0,120) || 'Unknown artist';
  let img = typeof t.img === 'string' ? t.img.slice(0,1000) : '';
  try { if (img && new URL(img).protocol !== 'https:') img = ''; } catch { img = ''; }
  const rawDuration = Number(t.duration);
  const duration = Number.isFinite(rawDuration) ? Math.max(1, Math.min(86400, Math.round(rawDuration))) : 200;
  return { id, title, artist, img, duration };
}
function cleanLibrary(v={}) {
  const ids = x => Array.isArray(x) ? [...new Set(x.filter(y=>typeof y==='string' && y.length<=120))].slice(0,500) : [];
  const likedTracks = Array.isArray(v.likedTracks) ? v.likedTracks.slice(0,500).map(cleanTrack).filter(Boolean) : [];
  const likedTrackIds = ids([...(Array.isArray(v.likedTrackIds) ? v.likedTrackIds : []), ...likedTracks.map(t=>t.id)]);
  const playlists = Array.isArray(v.playlists) ? v.playlists.slice(0,100).map(p => {
    const tracks = Array.isArray(p.tracks) ? p.tracks.slice(0,500).map(cleanTrack).filter(Boolean) : [];
    const trackIds = ids([...(Array.isArray(p.trackIds) ? p.trackIds : []), ...tracks.map(t=>t.id)]);
    return { id:String(p.id||'').slice(0,120), name:String(p.name||'').trim().slice(0,64), trackIds, tracks };
  }).filter(p=>p.id&&p.name) : [];
  return { likedTrackIds, likedTracks, savedAlbumIds:ids(v.savedAlbumIds), playlistIds:ids(v.playlistIds), playlists };
}
function slugTopic(title) {
  const slug = String(title || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 88);
  return `topic-${slug || 'community'}`;
}
async function seedCommunityTopics() {
  let catalog;
  try { catalog = JSON.parse(await readFile(path.join(ROOT, 'data', 'catalog.json'), 'utf8')); }
  catch { catalog = { discussionTopics: [] }; }
  const rows = Array.isArray(catalog.discussionTopics) ? catalog.discussionTopics : [];
  const insert = sqlite.prepare('INSERT OR IGNORE INTO community_topics(id,title,description,created_by,created_at,updated_at,is_seeded,sort_order,is_open) VALUES(?,?,?,NULL,?,?,1,?,1)');
  const now = new Date().toISOString();
  rows.forEach((topic, index) => {
    if (!topic || typeof topic.title !== 'string' || !topic.title.trim()) return;
    const title = topic.title.trim().slice(0, 120);
    const description = String(topic.description || 'A community-curated conversation about music.').trim().slice(0, 500);
    insert.run(slugTopic(title), title, description, now, now, index);
  });
}
function communityRole(userId) {
  if (!sqlite || !userId) return 'member';
  return sqlite.prepare('SELECT role FROM community_roles WHERE user_id=?').get(userId)?.role || 'member';
}
function canModerate(user) { return ['owner', 'moderator'].includes(communityRole(user?.id)); }
function canOwn(user) { return communityRole(user?.id) === 'owner'; }
function currentOwnerExists() { return sqlite.prepare("SELECT 1 AS found FROM community_roles WHERE role='owner' LIMIT 1").get() !== undefined; }
function ownerClaimAvailable() {
  const configured = typeof process.env.STARMUSICS_OWNER_SETUP_TOKEN === 'string' && process.env.STARMUSICS_OWNER_SETUP_TOKEN.length >= 32;
  const claimed = sqlite.prepare("SELECT value FROM app_meta WHERE key='owner_claimed'").get()?.value === 'true';
  return configured && !claimed && !currentOwnerExists();
}
function constantTokenMatch(candidate, expected) {
  const left = createHash('sha256').update(String(candidate)).digest();
  const right = createHash('sha256').update(String(expected)).digest();
  return timingSafeEqual(left, right);
}
function logCommunityAction(actorId, action, subjectType, subjectId, metadata = {}) {
  sqlite.prepare('INSERT INTO community_audit_log(id,actor_id,action,subject_type,subject_id,metadata_json,created_at) VALUES(?,?,?,?,?,?,?)')
    .run(randomBytes(16).toString('hex'), actorId, action, subjectType, String(subjectId), JSON.stringify(metadata), new Date().toISOString());
}
function actionRateLimited(req, route, limit = COMMUNITY_LIMIT) {
  const now = Date.now();
  const key = `${req.socket.remoteAddress || 'unknown'}:${route}`;
  let current = communityAttempts.get(key);
  if (!current || current.start + AUTH_WINDOW_MS <= now) current = { start: now, count: 0 };
  current.count += 1;
  communityAttempts.set(key, current);
  if (communityAttempts.size > 5000) for (const [k, v] of communityAttempts) if (v.start + AUTH_WINDOW_MS <= now) communityAttempts.delete(k);
  return current.count > limit;
}
function publicMember(userId) {
  const user = db.users.find(candidate => candidate.id === userId);
  if (!user) return null;
  const role = communityRole(userId);
  const visibleComments = sqlite.prepare("SELECT COUNT(*) AS n FROM community_comments WHERE user_id=? AND status='visible'").get(userId).n;
  return {
    id: user.id,
    name: String(user.profile?.name || 'Listener').slice(0, 32),
    bio: String(user.profile?.bio || '').slice(0, 180),
    role,
    roleLabel: role === 'owner' ? 'Site owner' : role === 'moderator' ? 'Moderator' : 'Community member',
    commentCount: visibleComments
  };
}
function listCommunityTopics() {
  return sqlite.prepare(`SELECT t.id,t.title,t.description,t.created_at,t.updated_at,t.is_seeded,t.is_open,
    (SELECT COUNT(*) FROM community_comments c WHERE c.topic_id=t.id AND c.status='visible') AS comment_count
    FROM community_topics t WHERE t.is_open=1 ORDER BY t.is_seeded DESC,t.sort_order ASC,t.created_at DESC LIMIT 200`).all()
    .map(row => ({ id:row.id, title:row.title, description:row.description, createdAt:row.created_at, updatedAt:row.updated_at, isSeeded:Boolean(row.is_seeded), isOpen:Boolean(row.is_open), commentCount:row.comment_count }));
}
function listTopicComments(topicId, viewerId = '') {
  return sqlite.prepare(`SELECT c.id,c.topic_id,c.user_id,c.body,c.created_at,u.data_json,
    (SELECT COUNT(*) FROM community_comment_likes l WHERE l.comment_id=c.id) AS likes_count,
    EXISTS(SELECT 1 FROM community_comment_likes l WHERE l.comment_id=c.id AND l.user_id=?) AS liked
    FROM community_comments c JOIN users u ON u.id=c.user_id
    WHERE c.topic_id=? AND c.status='visible' ORDER BY c.created_at ASC LIMIT 200`).all(viewerId || '', topicId).map(row => {
      const u = JSON.parse(row.data_json);
      return { id:row.id, topicId:row.topic_id, authorId:row.user_id, author:String(u.profile?.name || 'Listener').slice(0,32), text:row.body, created:row.created_at, likesCount:row.likes_count, liked:Boolean(row.liked), isMine:row.user_id === viewerId, role:communityRole(row.user_id) };
    });
}
function safeReport(row) {
  return { id:row.id, commentId:row.comment_id, topicId:row.topic_id, topicTitle:row.topic_title, commentText:row.comment_text,
    commentStatus:row.comment_status, commentAuthor:row.comment_author, reporterName:row.reporter_name, reason:row.reason,
    details:row.details, status:row.status, createdAt:row.created_at, moderatorNote:row.moderator_note || '' };
}
export function createServer() { return http.createServer(async (req,res)=>{ try {
  const url = new URL(req.url, ORIGIN); const route=url.pathname;
  if (req.method==='GET' && route==='/api/health') return json(res,200,{ok:true,service:'starmusics-api',version:2});
  if (!route.startsWith('/api/')) return json(res,404,{error:'Not found'});
  if (req.method==='OPTIONS') { if (!validOrigin(req)) return json(res,403,{error:'Origin not allowed'}); res.writeHead(204, {'access-control-allow-origin':ORIGIN,'access-control-allow-credentials':'true','access-control-allow-methods':'GET,POST,PUT,PATCH,OPTIONS','access-control-allow-headers':'Content-Type','access-control-max-age':'600','vary':'Origin'}); return res.end(); }
  if (!validOrigin(req)) return json(res,403,{error:'Origin not allowed'});
  if (['POST','PUT','PATCH','DELETE'].includes(req.method) && req.headers['content-type'] && !String(req.headers['content-type']).toLowerCase().startsWith('application/json')) return json(res,415,{error:'Content-Type must be application/json'});
  if (['POST','PUT','PATCH','DELETE'].includes(req.method) && !validWriteOrigin(req)) return json(res,403,{error:'A valid same-origin request is required'});
  if ((req.method==='POST') && ['/api/register','/api/login'].includes(route) && authRateLimited(req, route)) return json(res,429,{error:'Too many attempts. Wait a minute and try again.'},{'retry-after':'60'});
  if (req.method==='POST' && route==='/api/register') { const b=await body(req); const email=String(b.email||'').trim().toLowerCase(); const password=String(b.password||''); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254) return json(res,400,{error:'Enter a valid email address'}); if (password.length<12||password.length>256) return json(res,400,{error:'Password must be 12–256 characters'}); if(db.users.some(u=>u.email===email)) return json(res,409,{error:'Unable to create account with those details'}); const salt=randomBytes(16); const hash=await scrypt(password,salt,64); const user={id:randomBytes(16).toString('hex'),email,salt:salt.toString('hex'),hash:Buffer.from(hash).toString('hex'),profile:{name:'Listener',bio:''},library:{likedTrackIds:[],savedAlbumIds:[],playlistIds:[],playlists:[]},createdAt:new Date().toISOString()}; db.users.push(user); await persist(); const sid=randomBytes(32).toString('hex'); saveSession(sid,user.id); return json(res,201,{user:safeUser(user)},{'set-cookie':sessionCookie(sid)}); }
  if (req.method==='POST' && route==='/api/login') { const b=await body(req); const email=String(b.email||'').trim().toLowerCase(); const password=String(b.password||''); const user=db.users.find(u=>u.email===email); if(!user) { await scrypt(password,randomBytes(16),64); return json(res,401,{error:'Invalid email or password'}); } const hash=Buffer.from(await scrypt(password,Buffer.from(user.salt,'hex'),64)); const expected=Buffer.from(user.hash,'hex'); if(hash.length!==expected.length||!timingSafeEqual(hash,expected)) return json(res,401,{error:'Invalid email or password'}); const sid=randomBytes(32).toString('hex'); saveSession(sid,user.id); return json(res,200,{user:safeUser(user)},{'set-cookie':sessionCookie(sid)}); }
  if (req.method==='POST' && route==='/api/logout') { const sid=cookie(req,'starmusics_session'); deleteSession(sid); return json(res,200,{ok:true},{'set-cookie':sessionCookie('',0)}); }
  if (req.method==='GET' && route==='/api/community/status') return json(res,200,{enabled:true,ownerClaimAvailable:ownerClaimAvailable(),topicCount:listCommunityTopics().length});
  if (req.method==='GET' && route==='/api/community/topics') return json(res,200,{topics:listCommunityTopics()});
  const publicCommentsMatch = route.match(/^\/api\/community\/topics\/([a-z0-9-]{1,120})\/comments$/);
  if (req.method==='GET' && publicCommentsMatch) {
    const topicId=publicCommentsMatch[1];
    if (!sqlite.prepare('SELECT id FROM community_topics WHERE id=? AND is_open=1').get(topicId)) return json(res,404,{error:'Topic not found'});
    const viewer=current(req);
    const rows=listTopicComments(topicId,viewer?.id || '');
    if (url.searchParams.get('order')==='newest') rows.reverse();
    return json(res,200,{comments:rows});
  }
  const publicMemberMatch = route.match(/^\/api\/community\/members\/([a-f0-9]{32})$/);
  if (req.method==='GET' && publicMemberMatch) {
    const member=publicMember(publicMemberMatch[1]);
    return member ? json(res,200,{member}) : json(res,404,{error:'Member not found'});
  }
  const user=current(req); if(!user) return json(res,401,{error:'Sign in required'});
  if(req.method==='GET' && route==='/api/me') return json(res,200,{user:safeUser(user)});
  if(req.method==='GET' && route==='/api/community/me') {
    const commentCount=sqlite.prepare("SELECT COUNT(*) AS n FROM community_comments WHERE user_id=? AND status='visible'").get(user.id).n;
    return json(res,200,{role:communityRole(user.id),commentCount,ownerClaimAvailable:ownerClaimAvailable()});
  }
  if(req.method==='POST' && route==='/api/community/owner/claim') {
    if (actionRateLimited(req,'owner-claim',5)) return json(res,429,{error:'Too many attempts. Wait a minute and try again.'},{'retry-after':'60'});
    const b=await body(req); const candidate=typeof b.token==='string' ? b.token : '';
    const expected=process.env.STARMUSICS_OWNER_SETUP_TOKEN || '';
    if (!ownerClaimAvailable() || expected.length<32 || candidate.length<32 || candidate.length>256 || !constantTokenMatch(candidate,expected)) return json(res,403,{error:'Owner setup is unavailable or the secret is invalid'});
    sqlite.exec('BEGIN IMMEDIATE');
    try {
      if (currentOwnerExists() || sqlite.prepare("SELECT value FROM app_meta WHERE key='owner_claimed'").get()?.value==='true') { sqlite.exec('ROLLBACK'); return json(res,409,{error:'The installation owner has already been claimed'}); }
      const now=new Date().toISOString();
      sqlite.prepare('INSERT INTO community_roles(user_id,role,granted_by,created_at) VALUES(?,?,?,?)').run(user.id,'owner',user.id,now);
      sqlite.prepare("INSERT INTO app_meta(key,value) VALUES('owner_claimed','true') ON CONFLICT(key) DO UPDATE SET value='true'").run();
      logCommunityAction(user.id,'owner_claimed','member',user.id);
      sqlite.exec('COMMIT');
    } catch(error) { try { sqlite.exec('ROLLBACK'); } catch {} throw error; }
    return json(res,200,{user:safeUser(user),communityStatus:{enabled:true,ownerClaimAvailable:false}});
  }
  if(req.method==='POST' && route==='/api/community/topics') {
    if (!canOwn(user)) return json(res,403,{error:'Only the installation owner can create curated topics'});
    if (actionRateLimited(req,'create-topic',8)) return json(res,429,{error:'Topic creation is temporarily rate limited.'},{'retry-after':'60'});
    const b=await body(req); const title=String(b.title||'').trim(); const description=String(b.description||'').trim();
    if (title.length<4 || title.length>120) return json(res,400,{error:'Topic title must be 4–120 characters'});
    if (description.length>500) return json(res,400,{error:'Topic description must be at most 500 characters'});
    const id=`topic-${randomBytes(12).toString('hex')}`; const now=new Date().toISOString();
    sqlite.prepare('INSERT INTO community_topics(id,title,description,created_by,created_at,updated_at,is_seeded,sort_order,is_open) VALUES(?,?,?,?,?,?,0,0,1)').run(id,title,description,user.id,now,now);
    logCommunityAction(user.id,'topic_created','topic',id);
    return json(res,201,{topic:listCommunityTopics().find(t=>t.id===id)});
  }
  const createCommentMatch=route.match(/^\/api\/community\/topics\/([a-z0-9-]{1,120})\/comments$/);
  if (req.method==='POST' && createCommentMatch) {
    const topicId=createCommentMatch[1];
    if (actionRateLimited(req,`comment:${topicId}`,12)) return json(res,429,{error:'You are posting too quickly. Wait a minute and try again.'},{'retry-after':'60'});
    const topic=sqlite.prepare('SELECT id FROM community_topics WHERE id=? AND is_open=1').get(topicId);
    if (!topic) return json(res,404,{error:'Topic not found'});
    const b=await body(req); const text=String(b.text||'').replace(/\u0000/g,'').trim();
    if (!text || text.length>800) return json(res,400,{error:'Comment must be 1–800 characters'});
    const id=randomBytes(16).toString('hex'); const now=new Date().toISOString();
    sqlite.prepare("INSERT INTO community_comments(id,topic_id,user_id,body,status,created_at,updated_at) VALUES(?,?,?,?,'visible',?,?)").run(id,topicId,user.id,text,now,now);
    logCommunityAction(user.id,'comment_created','comment',id,{topicId});
    const comment=listTopicComments(topicId,user.id).find(row=>row.id===id);
    return json(res,201,{comment,topic:listCommunityTopics().find(row=>row.id===topicId)});
  }
  const commentLikeMatch=route.match(/^\/api\/community\/comments\/([a-f0-9]{32})\/like$/);
  if (req.method==='POST' && commentLikeMatch) {
    const commentId=commentLikeMatch[1];
    if (actionRateLimited(req,'comment-like',60)) return json(res,429,{error:'Too many reactions. Try again shortly.'},{'retry-after':'60'});
    const b=await body(req);
    if (typeof b.liked!=='boolean') return json(res,400,{error:'liked must be a boolean'});
    const comment=sqlite.prepare("SELECT id FROM community_comments WHERE id=? AND status='visible'").get(commentId);
    if (!comment) return json(res,404,{error:'Comment not found'});
    if (b.liked) sqlite.prepare('INSERT OR IGNORE INTO community_comment_likes(comment_id,user_id,created_at) VALUES(?,?,?)').run(commentId,user.id,new Date().toISOString());
    else sqlite.prepare('DELETE FROM community_comment_likes WHERE comment_id=? AND user_id=?').run(commentId,user.id);
    const likesCount=sqlite.prepare('SELECT COUNT(*) AS n FROM community_comment_likes WHERE comment_id=?').get(commentId).n;
    return json(res,200,{liked:Boolean(b.liked),likesCount});
  }
  const reportMatch=route.match(/^\/api\/community\/comments\/([a-f0-9]{32})\/report$/);
  if (req.method==='POST' && reportMatch) {
    const commentId=reportMatch[1];
    if (actionRateLimited(req,'community-report',8)) return json(res,429,{error:'Too many reports. Wait a minute and try again.'},{'retry-after':'60'});
    const b=await body(req); const reason=String(b.reason||''); const details=String(b.details||'').trim();
    if (!['spam','harassment','hate','copyright','other'].includes(reason)) return json(res,400,{error:'Choose a valid report reason'});
    if (details.length>300) return json(res,400,{error:'Report details must be at most 300 characters'});
    if (!sqlite.prepare("SELECT id FROM community_comments WHERE id=? AND status='visible'").get(commentId)) return json(res,404,{error:'Comment not found'});
    if (sqlite.prepare('SELECT id FROM community_reports WHERE comment_id=? AND reporter_id=?').get(commentId,user.id)) return json(res,409,{error:'You have already reported this comment'});
    const id=randomBytes(16).toString('hex'); const now=new Date().toISOString();
    sqlite.prepare("INSERT INTO community_reports(id,comment_id,reporter_id,reason,details,status,created_at) VALUES(?,?,?,?,?,'open',?)").run(id,commentId,user.id,reason,details,now);
    logCommunityAction(user.id,'comment_reported','comment',commentId,{reportId:id,reason});
    return json(res,201,{reportId:id,status:'open'});
  }
  if (req.method==='GET' && route==='/api/community/reports') {
    if (!canModerate(user)) return json(res,403,{error:'Moderator access required'});
    const reports=sqlite.prepare(`SELECT r.id,r.comment_id,r.reporter_id,r.reason,r.details,r.status,r.created_at,r.moderator_note,
      c.topic_id,c.body AS comment_text,c.status AS comment_status,cu.data_json AS comment_user_json,ru.data_json AS reporter_json,t.title AS topic_title
      FROM community_reports r JOIN community_comments c ON c.id=r.comment_id JOIN users cu ON cu.id=c.user_id JOIN users ru ON ru.id=r.reporter_id JOIN community_topics t ON t.id=c.topic_id
      ORDER BY CASE r.status WHEN 'open' THEN 0 WHEN 'reviewed' THEN 1 ELSE 2 END,r.created_at DESC LIMIT 500`).all().map(row=>safeReport({ ...row, comment_author:String(JSON.parse(row.comment_user_json).profile?.name || 'Listener').slice(0,32), reporter_name:String(JSON.parse(row.reporter_json).profile?.name || 'Listener').slice(0,32) }));
    return json(res,200,{reports});
  }
  const resolveReportMatch=route.match(/^\/api\/community\/reports\/([a-f0-9]{32})$/);
  if (req.method==='PATCH' && resolveReportMatch) {
    if (!canModerate(user)) return json(res,403,{error:'Moderator access required'});
    const reportId=resolveReportMatch[1]; const b=await body(req); const status=String(b.status||''); const note=String(b.moderatorNote||'').trim();
    if (!['open','reviewed','closed'].includes(status)) return json(res,400,{error:'Invalid report status'});
    if (note.length>500) return json(res,400,{error:'Moderator note must be at most 500 characters'});
    const exists=sqlite.prepare('SELECT id FROM community_reports WHERE id=?').get(reportId);
    if (!exists) return json(res,404,{error:'Report not found'});
    const now=new Date().toISOString();
    sqlite.prepare('UPDATE community_reports SET status=?,resolved_by=?,resolved_at=?,moderator_note=? WHERE id=?').run(status,status==='open'?null:user.id,status==='open'?null:now,note,reportId);
    logCommunityAction(user.id,'report_status_changed','report',reportId,{status});
    return json(res,200,{ok:true,status});
  }
  const moderateCommentMatch=route.match(/^\/api\/community\/comments\/([a-f0-9]{32})$/);
  if (req.method==='PATCH' && moderateCommentMatch) {
    if (!canModerate(user)) return json(res,403,{error:'Moderator access required'});
    const commentId=moderateCommentMatch[1]; const b=await body(req); const action=String(b.action||''); const reason=String(b.reason||'').trim();
    if (!['hide','restore'].includes(action)) return json(res,400,{error:'Action must be hide or restore'});
    if (reason.length>250) return json(res,400,{error:'Moderation reason must be at most 250 characters'});
    const comment=sqlite.prepare('SELECT id,topic_id,status FROM community_comments WHERE id=?').get(commentId);
    if (!comment) return json(res,404,{error:'Comment not found'});
    const hidden=action==='hide';
    sqlite.prepare('UPDATE community_comments SET status=?,updated_at=?,hidden_by=?,hidden_reason=? WHERE id=?').run(hidden?'hidden':'visible',new Date().toISOString(),hidden?user.id:null,hidden?reason:null,commentId);
    logCommunityAction(user.id,hidden?'comment_hidden':'comment_restored','comment',commentId,{reason});
    return json(res,200,{ok:true,status:hidden?'hidden':'visible',topicId:comment.topic_id});
  }
  const roleMatch=route.match(/^\/api\/community\/members\/([a-f0-9]{32})\/role$/);
  if (req.method==='PUT' && roleMatch) {
    if (!canOwn(user)) return json(res,403,{error:'Owner access required'});
    const targetId=roleMatch[1]; const b=await body(req); const role=String(b.role||'');
    if (!['moderator','member'].includes(role)) return json(res,400,{error:'Role must be moderator or member'});
    if (targetId===user.id) return json(res,400,{error:'The owner cannot change their own role here'});
    if (!db.users.some(candidate=>candidate.id===targetId)) return json(res,404,{error:'Member not found'});
    if (role==='moderator') sqlite.prepare("INSERT INTO community_roles(user_id,role,granted_by,created_at) VALUES(?, 'moderator', ?, ?) ON CONFLICT(user_id) DO UPDATE SET role='moderator',granted_by=excluded.granted_by,created_at=excluded.created_at").run(targetId,user.id,new Date().toISOString());
    else sqlite.prepare("DELETE FROM community_roles WHERE user_id=? AND role='moderator'").run(targetId);
    logCommunityAction(user.id,role==='moderator'?'moderator_granted':'moderator_revoked','member',targetId);
    return json(res,200,{member:publicMember(targetId)});
  }
  if(req.method==='PUT' && route==='/api/profile') { user.profile=cleanProfile(await body(req)); await persist(); return json(res,200,{profile:user.profile}); }
  if(req.method==='PUT' && route==='/api/library') { user.library=cleanLibrary(await body(req)); await persist(); return json(res,200,{library:user.library}); }
  return json(res,404,{error:'Not found'});
 } catch(e) { if(e.status) return json(res,e.status,{error:e.message}); return json(res,500,{error:'Internal server error'}); } }); }
if (process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) { await loadDb(); if(PROD && (!process.env.PUBLIC_ORIGIN || !/^https:\/\//.test(process.env.PUBLIC_ORIGIN))) { console.error('Production requires PUBLIC_ORIGIN=https://…'); process.exit(1); } const host=process.env.API_HOST||'127.0.0.1'; const port=Number(process.env.PORT||8787); createServer().listen(port,host,()=>console.log(`STARMUSICS API listening on http://${host}:${port}`)); }
export { loadDb, DB_FILE };
