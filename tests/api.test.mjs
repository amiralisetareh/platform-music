import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
let proc, base, dir;
async function start(){ dir=await mkdtemp(path.join(os.tmpdir(),'starmusics-api-')); const port=18000+Math.floor(Math.random()*20000); base=`http://127.0.0.1:${port}`; proc=spawn(process.execPath,['server/start.mjs'],{cwd:path.resolve(''),env:{...process.env,PORT:String(port),STARMUSICS_DATA_DIR:dir,PUBLIC_ORIGIN:base},stdio:'ignore'}); for(let i=0;i<60;i++){try{const r=await fetch(base+'/api/health');if(r.ok)return;}catch{} await delay(100);} throw new Error('API failed to start');}
async function stop(){proc?.kill('SIGTERM'); await delay(150); if(dir) await rm(dir,{recursive:true,force:true});}
test('Phase 7 API auth, persistence and origin protections', async t=>{await start(); t.after(stop);
 let r=await fetch(base+'/api/health'); assert.equal(r.status,200); assert.equal(r.headers.get('x-frame-options'),'DENY'); assert.equal(r.headers.get('cache-control'),'no-store');
 r=await fetch(base+'/api/register',{method:'POST',headers:{'content-type':'application/json',origin:base},body:JSON.stringify({email:'listener@example.com',password:'long-enough-password-123'})}); assert.equal(r.status,201); const cookie=r.headers.get('set-cookie').split(';')[0]; const registered=await r.json(); assert.equal(registered.user.email,'listener@example.com');
 r=await fetch(base+'/api/me',{headers:{cookie}}); assert.equal(r.status,200);
 r=await fetch(base+'/api/profile',{method:'PUT',headers:{cookie,origin:base,'content-type':'application/json'},body:JSON.stringify({name:'Listener 2',bio:'Test profile'})}); assert.equal(r.status,200);
 r=await fetch(base+'/api/library',{method:'PUT',headers:{cookie,origin:base,'content-type':'application/json'},body:JSON.stringify({likedTrackIds:['track-1','track-1',3],likedTracks:[{id:'track-1',title:'Saved Track',artist:'Example Artist',img:'https://example.com/cover.jpg',duration:203},{id:'bad-image',title:'Unsafe image',img:'javascript:alert(1)'}],savedAlbumIds:['album-1'],playlists:[{id:'p1',name:'Mix',trackIds:['track-1','track-1'],tracks:[{id:'track-1',title:'Saved Track',artist:'Example Artist',img:'https://example.com/cover.jpg',duration:203}]}]})}); assert.equal(r.status,200); const saved=await r.json(); assert.deepEqual(saved.library.likedTrackIds,['track-1','bad-image']); assert.equal(saved.library.likedTracks[0].title,'Saved Track'); assert.equal(saved.library.likedTracks[1].img,''); assert.deepEqual(saved.library.playlists[0].trackIds,['track-1']); assert.equal(saved.library.playlists[0].tracks[0].title,'Saved Track');
 r=await fetch(base+'/api/library',{method:'PUT',headers:{cookie,origin:'https://evil.example','content-type':'application/json'},body:'{}'}); assert.equal(r.status,403);
 r=await fetch(base+'/api/login',{method:'POST',headers:{'content-type':'application/json',origin:base},body:JSON.stringify({email:'listener@example.com',password:'wrong-password-123'})}); assert.equal(r.status,401);
 r=await fetch(base+'/api/logout',{method:'POST',headers:{cookie,origin:base}}); assert.equal(r.status,200);
 r=await fetch(base+'/api/me',{headers:{cookie}}); assert.equal(r.status,401);
 r=await fetch(base+'/api/login',{method:'POST',headers:{'content-type':'application/json',origin:base},body:JSON.stringify({email:'listener@example.com',password:'long-enough-password-123'})}); assert.equal(r.status,200); const newCookie=r.headers.get('set-cookie').split(';')[0];
 r=await fetch(base+'/api/me',{headers:{cookie:newCookie}}); const restored=await r.json(); assert.equal(restored.user.profile.name,'Listener 2'); assert.equal(restored.user.library.playlists[0].tracks[0].title,'Saved Track');
});
test('registration rejects weak passwords and oversized bodies', async t=>{await start(); t.after(stop); let r=await fetch(base+'/api/register',{method:'POST',headers:{'content-type':'application/json',origin:base},body:JSON.stringify({email:'a@b.com',password:'short'})}); assert.equal(r.status,400); r=await fetch(base+'/api/register',{method:'POST',headers:{'content-type':'application/json',origin:base},body:'x'.repeat(70000)}); assert.equal(r.status,413);});

test('authentication endpoints throttle repeated attempts per IP and route', async t=>{ await start(); t.after(stop); let r; for(let i=0;i<10;i++) r=await fetch(base+'/api/register',{method:'POST',headers:{'content-type':'application/json',origin:base},body:JSON.stringify({email:'invalid',password:'weak'})}); assert.equal(r.status,400); r=await fetch(base+'/api/register',{method:'POST',headers:{'content-type':'application/json',origin:base},body:JSON.stringify({email:'invalid',password:'weak'})}); assert.equal(r.status,429); assert.equal(r.headers.get('retry-after'),'60'); });

test('Phase 8 SQLite storage keeps accounts and sessions across API restarts', async t => {
  await start(); t.after(stop);
  let r = await fetch(base + '/api/register', { method:'POST', headers:{'content-type':'application/json', origin:base}, body:JSON.stringify({email:'persistent@example.com',password:'persistent-password-123'}) });
  assert.equal(r.status,201);
  const cookie = r.headers.get('set-cookie').split(';')[0];
  r = await fetch(base + '/api/profile', { method:'PUT', headers:{cookie,origin:base,'content-type':'application/json'}, body:JSON.stringify({name:'Persistent Listener',bio:'Survives restart'}) });
  assert.equal(r.status,200);
  proc.kill('SIGTERM'); await delay(200);
  proc = spawn(process.execPath,['server/start.mjs'],{cwd:path.resolve(''),env:{...process.env,PORT:base.split(':').pop(),STARMUSICS_DATA_DIR:dir,PUBLIC_ORIGIN:base},stdio:'ignore'});
  let ready = false;
  for(let i=0;i<60;i++){ try { const health=await fetch(base+'/api/health'); if(health.ok){ready=true;break;} } catch {} await delay(100); }
  assert.equal(ready,true,'API should restart against the same SQLite file');
  r = await fetch(base+'/api/me',{headers:{cookie}});
  assert.equal(r.status,200,'hashed session should remain valid after restart');
  const data=await r.json(); assert.equal(data.user.profile.name,'Persistent Listener');
  assert.equal(data.user.profile.bio,'Survives restart');
});

test('API rejects non-JSON write requests', async t => {
  await start(); t.after(stop);
  const r=await fetch(base+'/api/register',{method:'POST',headers:{origin:base,'content-type':'text/plain'},body:'email=a@b.com'});
  assert.equal(r.status,415);
});
