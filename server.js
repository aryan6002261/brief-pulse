/**
 * Zero-dependency local development server for BriefPulse.
 * Loads .env automatically, serves index.html & assets/, and mounts Vercel /api/* routes.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const PORT = Number(process.env.PORT) || 3000;

function loadDotEnv(envPath) {
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, 'utf8');
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const clean = line.startsWith('export ') ? line.slice(7).trim() : line;
    const eqIndex = clean.indexOf('=');
    if (eqIndex <= 0) continue;
    const key = clean.slice(0, eqIndex).trim();
    let value = clean.slice(eqIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadDotEnv(path.join(ROOT_DIR, '.env'));

const healthHandler = require('./api/health');
const briefingHandler = require('./api/briefing');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

function serveStaticFile(reqPath, res) {
  const safePath = reqPath === '/' ? '/index.html' : reqPath;
  const resolved = path.resolve(PUBLIC_DIR, `.${safePath}`);

  if (!resolved.startsWith(PUBLIC_DIR + path.sep) && resolved !== path.join(PUBLIC_DIR, 'index.html')) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }

  // Only allow serving index.html and assets/* inside public/
  const rel = path.relative(PUBLIC_DIR, resolved).replace(/\\/g, '/');
  if (rel !== 'index.html' && !rel.startsWith('assets/')) {
    res.statusCode = 404;
    res.end('Not Found');
    return;
  }

  fs.readFile(resolved, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end('Not Found');
      return;
    }
    const ext = path.extname(resolved).toLowerCase();
    res.setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream');
    res.statusCode = 200;
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  const urlPath = (req.url || '/').split('?')[0];

  if (urlPath === '/api/health') {
    await healthHandler(req, res);
    return;
  }

  if (urlPath === '/api/briefing') {
    await briefingHandler(req, res);
    return;
  }

  serveStaticFile(urlPath, res);
});

server.listen(PORT, () => {
  const hasTavily = Boolean(process.env.TAVILY_API_KEY);
  console.log(`\nBriefPulse Research Agent running at http://localhost:${PORT}`);
  console.log(`TAVILY_API_KEY loaded from .env: ${hasTavily ? 'YES' : 'NO (add to .env or test via sample mode)'}\n`);
});

