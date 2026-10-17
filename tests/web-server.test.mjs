import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

let proc;
const port = 30000 + Math.floor(Math.random() * 20000);
const base = `http://127.0.0.1:${port}`;
async function startServer() {
  proc = spawn(process.execPath, ['scripts/start-web.mjs'], {
    cwd: process.cwd(),
    env: { ...process.env, WEB_HOST:'127.0.0.1', WEB_PORT:String(port) },
    stdio:'ignore'
  });
  for (let i=0; i<80; i+=1) {
    try { const response=await fetch(`${base}/`); if (response.ok) return; } catch {}
    await delay(75);
  }
  throw new Error('Safe frontend server failed to start');
}

 test('safe frontend server serves UI assets and blocks private/source files and path traversal', async t => {
   await startServer();
   t.after(() => { proc?.kill('SIGTERM'); });
   const home = await fetch(`${base}/`);
   assert.equal(home.status,200);
   assert.match(home.headers.get('content-type') || '', /text\/html/);
   assert.match(await home.text(), /STARMUSICS/);
   for (const file of ['/app.js','/styles.css','/design/phase-5-community-backend.css']) {
     const response=await fetch(`${base}${file}`);
     assert.equal(response.status,200,`${file} should be a public frontend asset`);
   }
   for (const file of ['/.env','/.env.example','/server/api.mjs','/scripts/start-api.mjs','/tests/community-backend.test.mjs','/data/catalog.json','/README.md','/package.json','/accounts.json','/design/phase-1-home-navigation.md','/../README.md','/design/%2e%2e/README.md']) {
     const response=await fetch(`${base}${file}`);
     assert.equal(response.status,404,`${file} must not be exposed by the frontend server`);
   }
   const method = await fetch(`${base}/`,{method:'POST'});
   assert.equal(method.status,405);
 });
