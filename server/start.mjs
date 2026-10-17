import { loadDb, createServer } from './api.mjs';
await loadDb();
if (process.env.NODE_ENV === 'production' && (!process.env.PUBLIC_ORIGIN || !process.env.PUBLIC_ORIGIN.startsWith('https://'))) throw new Error('Production requires PUBLIC_ORIGIN=https://…');
const host=process.env.API_HOST||'127.0.0.1'; const port=Number(process.env.PORT||8787); createServer().listen(port,host,()=>console.log(`STARMUSICS API listening on http://${host}:${port}`));
