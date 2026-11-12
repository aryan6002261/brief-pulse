const { runResearchAgent } = require('../lib/agent');

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    if (req.body && typeof req.body === 'object') {
      resolve(req.body);
      return;
    }
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 1024 * 64) {
        reject(new Error('Request payload too large'));
      }
    });
    req.on('end', () => {
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error('Invalid JSON request body'));
      }
    });
    req.on('error', reject);
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Method not allowed. Use POST.' }));
    return;
  }

  try {
    const body = await readJsonBody(req);
    const target = typeof body.target === 'string' ? body.target.trim() : '';
    const entityType = typeof body.entityType === 'string' ? body.entityType : 'auto';
    const meetingDateTime = typeof body.meetingDateTime === 'string' ? body.meetingDateTime : '';
    const meetingContext = typeof body.meetingContext === 'string' ? body.meetingContext : '';
    const depth = body.depth === 'standard' ? 'standard' : 'deep';

    // Prefer .env / Vercel env var; optionally accept header override if user tests BYOK
    const headerKey = typeof req.headers['x-tavily-key'] === 'string' ? req.headers['x-tavily-key'].trim() : '';
    const tavilyApiKey = (process.env.TAVILY_API_KEY || '').trim() || headerKey;

    const result = await runResearchAgent({
      target,
      entityType,
      meetingDateTime,
      meetingContext,
      depth,
      tavilyApiKey,
      env: process.env,
    });

    res.statusCode = 200;
    res.end(JSON.stringify(result));
  } catch (err) {
    const status = err.status && Number.isInteger(err.status) ? err.status : 500;
    res.statusCode = status;
    res.end(
      JSON.stringify({
        error: err.message || 'Failed to generate pre-meeting briefing.',
      })
    );
  }
};

