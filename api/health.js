module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  const tavilyConfigured = Boolean(process.env.TAVILY_API_KEY && process.env.TAVILY_API_KEY.trim());
  const bifrostConfigured = Boolean(process.env.BIFROST_BASE_URL);
  const openAiConfigured = Boolean(process.env.OPENAI_API_KEY);
  const geminiConfigured = Boolean(process.env.GEMINI_API_KEY);

  let llmEngine = 'Native Tavily Grounded Synthesis';
  if (bifrostConfigured) llmEngine = 'Bifrost Gateway';
  else if (openAiConfigured) llmEngine = 'OpenAI';
  else if (geminiConfigured) llmEngine = 'Gemini';

  res.statusCode = 200;
  res.end(
    JSON.stringify({
      ok: true,
      tavilyConfigured,
      llmEngine,
      runtime: process.env.VERCEL ? 'vercel-serverless' : 'local-node',
    })
  );
};

