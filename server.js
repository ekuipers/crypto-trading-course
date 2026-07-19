// CryptoPro Training — Node.js entrypoint.
// Serves the course's built React app (client/dist, built via `npm run
// build` -> `vite build`), plus its CSS/JS from src/css and src/js (the
// course content + interactive logic, loaded as a classic script after
// React mounts — see client/src/scriptLoader.js), and remaining static
// assets (favicons, trading-journal.xlsx) from /docs.
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import { installAuthRoutes } from './src/auth.js';
import * as db from './src/db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf8'));

const app = express();
const PORT = process.env.PORT || 3000;

// Correct client IP behind a reverse proxy (Vercel) — needed for auth's
// per-IP rate limiting.
app.set('trust proxy', 1);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: pkg.version, time: new Date().toISOString() });
});

// CSRF mitigation for the auth API: reject mutating /api/* requests whose
// Origin/Referer host doesn't match this app's own host. SameSite=Lax on the
// session cookie is the primary defense; this is a second layer.
const MUTATING = new Set(['POST', 'PUT', 'DELETE', 'PATCH']);
app.use((req, res, next) => {
  if (!MUTATING.has(req.method) || !req.path.startsWith('/api/')) return next();
  const origin = req.headers.origin || req.headers.referer;
  if (!origin) return next();
  try {
    if (new URL(origin).host === req.headers.host) return next();
  } catch { /* fall through to reject */ }
  res.status(403).json({ error: 'Cross-origin request rejected' });
});

app.use(express.json({ limit: '2mb' }));

// Multi-user auth (SSO) — accounts & sessions persist in the same Supabase
// Postgres database as the rest of CryptoPro Suite. See src/db.js.
installAuthRoutes(app);

app.use('/js', express.static(join(__dirname, 'src', 'js')));
app.use('/css', express.static(join(__dirname, 'src', 'css')));
app.use(express.static(join(__dirname, 'client', 'dist')));
app.use(express.static(join(__dirname, 'docs')));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'client', 'dist', 'index.html'));
});

db.init()
  .catch(e => console.error('[db] init failed:', e?.message || e))
  .finally(() => {
    if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
      app.listen(PORT, () => {
        console.log(`CryptoPro Training listening on http://localhost:${PORT}`);
      });
    }
  });

export default app;
