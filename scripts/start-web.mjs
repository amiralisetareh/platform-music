import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Minimal local frontend server. Only explicit public UI assets can be served;
// .env, source-only folders, databases, tests, schemas and documentation are never exposed.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const HOST = process.env.WEB_HOST || '127.0.0.1';
const PORT = Number(process.env.WEB_PORT || 8080);
const PUBLIC_FILES = new Set([
  'index.html', 'styles.css', 'app.js', 'config.js', 'catalog-data.js',
  'catalog-service.js', 'artwork-fallback.js'
]);
const PUBLIC_DESIGN_FILE = /^design\/phase-[1-5]-[a-z0-9-]+\.css$/;
const TYPES = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp', '.ico':'image/x-icon' };

function resolvePublicPath(rawPath) {
  let decoded;
  try { decoded = decodeURIComponent(rawPath); } catch { return null; }
  if (decoded.includes('\\') || decoded.includes('\0')) return null;
  const normalized = decoded === '/' ? 'index.html' : decoded.replace(/^\/+/, '');
  if (!normalized || normalized.split('/').some(segment => !segment || segment === '.' || segment === '..' || segment.startsWith('.'))) return null;
  if (!(PUBLIC_FILES.has(normalized) || PUBLIC_DESIGN_FILE.test(normalized))) return null;
  const absolute = path.resolve(ROOT, normalized);
  if (!absolute.startsWith(`${ROOT}${path.sep}`)) return null;
  return { absolute, normalized };
}

const server = http.createServer(async (req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405, { 'allow':'GET, HEAD', 'cache-control':'no-store', 'x-content-type-options':'nosniff' });
    return res.end('Method not allowed');
  }
  const target = resolvePublicPath(new URL(req.url, `http://${req.headers.host || 'localhost'}`).pathname);
  if (!target) {
    res.writeHead(404, { 'content-type':'text/plain; charset=utf-8', 'cache-control':'no-store', 'x-content-type-options':'nosniff', 'x-frame-options':'DENY', 'referrer-policy':'no-referrer' });
    return res.end('Not found');
  }
  try {
    const info = await stat(target.absolute);
    if (!info.isFile()) throw Object.assign(new Error('Not a file'), { code:'ENOENT' });
    const content = await readFile(target.absolute);
    res.writeHead(200, {
      'content-type':TYPES[path.extname(target.normalized)] || 'application/octet-stream',
      'content-length':content.length,
      'cache-control':'no-cache',
      'x-content-type-options':'nosniff',
      'x-frame-options':'DENY',
      'referrer-policy':'no-referrer',
      'cross-origin-resource-policy':'same-origin',
      'permissions-policy':'camera=(), microphone=(), geolocation=()'
    });
    res.end(req.method === 'HEAD' ? undefined : content);
  } catch (error) {
    const status = error.code === 'ENOENT' ? 404 : 500;
    res.writeHead(status, { 'content-type':'text/plain; charset=utf-8', 'cache-control':'no-store', 'x-content-type-options':'nosniff' });
    res.end(status === 404 ? 'Not found' : 'Unable to serve asset');
  }
});
server.listen(PORT, HOST, () => console.log(`STARMUSICS safe frontend server: http://${HOST}:${PORT}`));
