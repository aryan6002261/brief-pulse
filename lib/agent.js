/**
 * BriefPulse — Autonomous Pre-Meeting Research Agent
 * Powered by Tavily Search & Extract APIs, with optional Bifrost / OpenAI / Gemini synthesis
 * and a zero-extra-key Native Tavily Grounded Synthesis Engine.
 */

const TAVILY_SEARCH_URL = 'https://api.tavily.com/search';
const TAVILY_EXTRACT_URL = 'https://api.tavily.com/extract';

function toIsoDate(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date, days) {
  const copy = new Date(date.getTime());
  copy.setUTCDate(copy.getUTCDate() + days);
  return copy;
}

/**
 * Computes the 30-day lookback window relative to the scheduled meeting date.
 */
function computeLookbackWindow(meetingDateTime) {
  const now = new Date();
  const todayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  let meetingDate = now;
  if (meetingDateTime) {
    const parsed = new Date(meetingDateTime);
    if (!Number.isNaN(parsed.getTime())) {
      meetingDate = parsed;
    }
  }

  const meetingDayUtc = new Date(
    Date.UTC(meetingDate.getUTCFullYear(), meetingDate.getUTCMonth(), meetingDate.getUTCDate())
  );

  // Preceding 30 days relative to the scheduled meeting, capped to today for live web search
  let windowEnd = meetingDayUtc > todayUtc ? todayUtc : meetingDayUtc;
  let windowStart = addDays(meetingDayUtc, -30);
  let windowNote = 'Exact 30-day window preceding scheduled meeting';

  if (meetingDayUtc > todayUtc) {
    if (windowStart >= todayUtc) {
      windowStart = addDays(todayUtc, -30);
      windowNote =
        'Meeting is more than 30 days away; anchored to the most recent 30 days of live developments';
    } else {
      windowNote = `30-day pre-meeting window anchored to meeting date (${toIsoDate(meetingDayUtc)}), bounded to live sources up to today (${toIsoDate(todayUtc)})`;
    }
  }

  return {
    meetingIso: meetingDate.toISOString(),
    meetingDateFormatted: toIsoDate(meetingDayUtc),
    startDate: toIsoDate(windowStart),
    endDate: toIsoDate(windowEnd),
    windowNote,
  };
}

function detectEntityType(target, requestedType) {
  if (requestedType === 'company' || requestedType === 'person') {
    return requestedType;
  }
  const lower = target.toLowerCase();
  const companyHints = [
    'inc', 'corp', 'llc', 'ltd', 'ai', 'labs', 'tech', 'systems', 'io', '.com',
    'platform', 'cloud', 'ventures', 'capital', 'group', 'software', 'studio',
  ];
  if (companyHints.some((hint) => lower.includes(hint))) {
    return 'company';
  }
  const words = target.trim().split(/\s+/);
  if (words.length >= 2 && words.length <= 3 && !target.includes('&')) {
    return 'person';
  }
  return 'company';
}

function planQueries({ target, entityType, meetingContext, startDate, endDate }) {
  const cleanTarget = target.trim();
  const contextSuffix = meetingContext ? ` ${meetingContext.trim().slice(0, 60)}` : '';
  const monthYear = endDate.slice(0, 7);

  if (entityType === 'person') {
    return [
      {
        pillar: 'news',
        label: 'News & Public Appearances',
        topic: 'news',
        query: `"${cleanTarget}" news interview announcement ${monthYear}`,
      },
      {
        pillar: 'launches',
        label: 'Initiatives, Projects & Talks',
        topic: 'general',
        query: `"${cleanTarget}" launched OR announced OR keynote OR podcast${contextSuffix}`,
      },
      {
        pillar: 'hires',
        label: 'Role Changes, Board & Leadership Moves',
        topic: 'general',
        query: `"${cleanTarget}" appointed OR joined OR role OR board OR advisor OR team`,
      },
      {
        pillar: 'updates',
        label: 'Strategic Opinions & Background',
        topic: 'general',
        query: `"${cleanTarget}" statement OR post OR strategy OR partnership`,
      },
    ];
  }

  return [
    {
      pillar: 'news',
      label: 'Recent News & Announcements',
      topic: 'news',
      query: `"${cleanTarget}" news announcement updates ${monthYear}`,
    },
    {
      pillar: 'launches',
      label: 'Product Launches & Releases',
      topic: 'general',
      query: `"${cleanTarget}" launch OR release OR new feature OR integration OR API${contextSuffix}`,
    },
    {
      pillar: 'hires',
      label: 'Executive Hires & Leadership',
      topic: 'general',
      query: `"${cleanTarget}" hired OR appointed OR joins OR VP OR CEO OR CTO OR leadership`,
    },
    {
      pillar: 'updates',
      label: 'Funding, Partnerships & Market Signals',
      topic: 'news',
      query: `"${cleanTarget}" partnership OR funding OR acquisition OR customer OR milestone`,
    },
  ];
}

function canonicalizeUrl(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
    const paramsToDelete = [];
    for (const key of parsed.searchParams.keys()) {
      if (key.startsWith('utm_') || key === 'ref' || key === 'source') {
        paramsToDelete.push(key);
      }
    }
    paramsToDelete.forEach((k) => parsed.searchParams.delete(k));
    parsed.hash = '';
    return parsed.toString().replace(/\/$/, '');
  } catch {
    return null;
  }
}

function getDomain(rawUrl) {
  try {
    return new URL(rawUrl).hostname.replace(/^www\./, '');
  } catch {
    return 'web';
  }
}

async function callTavilySearch(apiKey, plan, { startDate, endDate, depth }) {
  const payload = {
    query: plan.query,
    topic: plan.topic,
    search_depth: depth === 'deep' ? 'advanced' : 'basic',
    max_results: depth === 'deep' ? 6 : 5,
    include_answer: true,
    start_date: startDate,
    end_date: endDate,
  };

  const response = await fetch(TAVILY_SEARCH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    const err = new Error(`Tavily Search error (${response.status}): ${errorText || response.statusText}`);
    err.status = response.status;
    throw err;
  }

  const data = await response.json();
  return {
    pillar: plan.pillar,
    label: plan.label,
    query: plan.query,
    topic: plan.topic,
    answer: data.answer || '',
    results: Array.isArray(data.results) ? data.results : [],
  };
}

async function callTavilyExtract(apiKey, urls) {
  if (!urls.length) return { results: [], failed_results: [] };

  const response = await fetch(TAVILY_EXTRACT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      urls: urls.slice(0, 5),
      extract_depth: 'basic',
      format: 'markdown',
    }),
  });

  if (!response.ok) {
    return { results: [], failed_results: urls.map((u) => ({ url: u, error: response.statusText })) };
  }

  return response.json();
}

function classifyFindingCategory(item, pillarHint) {
  const text = `${item.title || ''} ${item.content || ''} ${item.extractedExcerpt || ''}`.toLowerCase();

  const rules = [
    {
      category: 'hires',
      keywords: [
        'hire', 'hired', 'hiring', 'appoint', 'appointed', 'joins', 'joined', 'named ceo',
        'named cto', 'chief ', 'vp of', 'vice president', 'executive', 'board of directors',
        'leadership', 'head of', 'promoted', 'depart', 'stepped down',
      ],
    },
    {
      category: 'launches',
      keywords: [
        'launch', 'launched', 'unveil', 'unveiled', 'release', 'released', 'introduces',
        'introduced', 'rolls out', 'rollout', 'new feature', 'new product', 'version',
        'v2', 'v3', 'api', 'sdk', 'model', 'general availability', 'beta', 'open-source',
      ],
    },
    {
      category: 'updates',
      keywords: [
        'funding', 'raised', 'series ', 'valuation', 'acquisition', 'acquired', 'merger',
        'partner', 'partnership', 'collaboration', 'revenue', 'arr', 'milestone', 'expansion',
        'regulation', 'compliance', 'ipo', 'earnings',
      ],
    },
    {
      category: 'news',
      keywords: ['news', 'report', 'interview', 'keynote', 'conference', 'announced', 'statement'],
    },
  ];

  let bestCategory = pillarHint || 'news';
  let bestScore = 0;

  for (const rule of rules) {
    let score = 0;
    for (const kw of rule.keywords) {
      if (text.includes(kw)) score += 1;
    }
    if (rule.category === pillarHint) score += 0.5;
    if (score > bestScore) {
      bestScore = score;
      bestCategory = rule.category;
    }
  }

  return bestCategory;
}

function cleanSnippet(text, maxLen = 280) {
  if (!text) return '';
  const normalized = text
    .replace(/!\[.*?\]\(.*?\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#>*_`~]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (normalized.length <= maxLen) return normalized;
  const sliced = normalized.slice(0, maxLen);
  const lastPeriod = sliced.lastIndexOf('. ');
  if (lastPeriod > maxLen * 0.55) {
    return sliced.slice(0, lastPeriod + 1);
  }
  return `${sliced.trim()}...`;
}

function extractBestExcerpt(rawMarkdown, target) {
  if (!rawMarkdown) return '';
  const lines = rawMarkdown
    .split(/\n+/)
    .map((line) => line.replace(/^[#>*\-\s]+/, '').trim())
    .filter((line) => line.length > 70 && line.length < 480 && !line.includes('http'));

  const targetLower = target.toLowerCase();
  const targetMatch = lines.find((l) => l.toLowerCase().includes(targetLower));
  return cleanSnippet(targetMatch || lines[0] || '', 300);
}

function buildNativeBriefing({ target, entityType, meetingContext, window, pillarResults, sources }) {
  const answers = pillarResults
    .map((p) => (p.answer || '').trim())
    .filter(Boolean);

  // Deduplicate and rank findings by score + recency
  const sortedSources = [...sources].sort((a, b) => (b.score || 0) - (a.score || 0));

  const findings = [];
  const seenTitles = new Set();

  for (const src of sortedSources) {
    const normTitle = (src.title || '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 48);
    if (!normTitle || seenTitles.has(normTitle)) continue;
    seenTitles.add(normTitle);

    const summaryText = src.extractedExcerpt && src.extractedExcerpt.length > 90
      ? src.extractedExcerpt
      : cleanSnippet(src.snippet, 260);

    if (!summaryText) continue;

    findings.push({
      category: src.category,
      headline: cleanSnippet(src.title, 110),
      summary: summaryText,
      publishedDate: src.publishedDate || null,
      domain: src.domain,
      sourceIds: [src.id],
    });

    if (findings.length >= 10) break;
  }

  // Construct Executive Summary
  let executiveSummary = '';
  if (answers.length > 0) {
    executiveSummary = cleanSnippet(answers.slice(0, 2).join(' '), 460);
  } else if (findings.length > 0) {
    executiveSummary = findings
      .slice(0, 3)
      .map((f) => f.summary)
      .join(' ');
    executiveSummary = cleanSnippet(executiveSummary, 460);
  } else {
    executiveSummary = `No major public developments were indexed for ${target} between ${window.startDate} and ${window.endDate}. Consider broadening the entity name or reviewing niche industry channels before the meeting.`;
  }

  // Build tailored Discussion Points grounded in discovered categories
  const byCat = {
    launches: findings.filter((f) => f.category === 'launches'),
    hires: findings.filter((f) => f.category === 'hires'),
    updates: findings.filter((f) => f.category === 'updates'),
    news: findings.filter((f) => f.category === 'news'),
  };

  const discussionPoints = [];
  if (byCat.launches.length) {
    const f = byCat.launches[0];
    discussionPoints.push({
      topic: `Recent Product & Initiative Momentum`,
      detail: `Reference "${f.headline}" and explore how this release shapes ${target}'s roadmap over the next two quarters.`,
      sourceIds: f.sourceIds,
    });
  }
  if (byCat.hires.length) {
    const f = byCat.hires[0];
    discussionPoints.push({
      topic: `Leadership & Organizational Priorities`,
      detail: `Acknowledge recent team/leadership news (${f.headline}) and align on who owns key decisions moving forward.`,
      sourceIds: f.sourceIds,
    });
  }
  if (byCat.updates.length) {
    const f = byCat.updates[0];
    discussionPoints.push({
      topic: `Strategic Partnerships & Growth Signals`,
      detail: `Connect your agenda to recent market movement (${f.headline}) to frame mutual value early in the conversation.`,
      sourceIds: f.sourceIds,
    });
  }
  if (byCat.news.length) {
    const f = byCat.news[0];
    discussionPoints.push({
      topic: `Current Public Narrative`,
      detail: `Use recent coverage (${f.headline}) as a warm opener to validate what is top-of-mind for ${target} right now.`,
      sourceIds: f.sourceIds,
    });
  }
  if (meetingContext) {
    discussionPoints.push({
      topic: `Meeting Goal Alignment: ${cleanSnippet(meetingContext, 65)}`,
      detail: `Tie the last 30 days of ${target}'s activity directly back to your primary objective (${cleanSnippet(meetingContext, 90)}).`,
      sourceIds: findings[0]?.sourceIds || [],
    });
  }

  // Build Open Questions
  const openQuestions = [];
  if (byCat.launches.length) {
    openQuestions.push({
      question: `Following "${cleanSnippet(byCat.launches[0].headline, 70)}", what customer adoption or technical bottlenecks have surprised your team most so far?`,
      rationale: 'Uncovers real execution realities behind recent launch announcements.',
      sourceIds: byCat.launches[0].sourceIds,
    });
  } else {
    openQuestions.push({
      question: `What upcoming releases or milestones are highest priority for ${target} over the next 60–90 days?`,
      rationale: 'Surfaces unannounced roadmap initiatives not yet visible in recent press.',
      sourceIds: [],
    });
  }

  if (byCat.hires.length) {
    openQuestions.push({
      question: `With recent leadership and hiring moves, how are responsibilities and decision-making evolving across teams?`,
      rationale: 'Clarifies stakeholders, champions, and procurement/execution ownership.',
      sourceIds: byCat.hires[0].sourceIds,
    });
  } else {
    openQuestions.push({
      question: `Which teams or executives will be most involved in evaluating or sponsoring our collaboration?`,
      rationale: 'No recent public leadership changes surfaced in the 30-day window; confirm org ownership live.',
      sourceIds: [],
    });
  }

  if (byCat.updates.length) {
    openQuestions.push({
      question: `How do recent partnership or market developments (${cleanSnippet(byCat.updates[0].headline, 60)}) change your near-term build-vs-buy priorities?`,
      rationale: 'Tests whether recent external moves open new budget or integration needs.',
      sourceIds: byCat.updates[0].sourceIds,
    });
  }

  openQuestions.push({
    question: meetingContext
      ? `Looking specifically at ${cleanSnippet(meetingContext, 70)}, what would make a partnership or next step a clear win this quarter?`
      : `What is the single biggest bottleneck ${entityType === 'person' ? 'you are' : `${target} is`} trying to unblock this quarter?`,
    rationale: 'Drives directly toward concrete next steps and measurable success criteria.',
    sourceIds: findings[0]?.sourceIds || [],
  });

  return {
    engine: 'Native Tavily Grounded Synthesis Engine',
    executiveSummary,
    findings,
    discussionPoints: discussionPoints.slice(0, 5),
    openQuestions: openQuestions.slice(0, 5),
  };
}

async function callLlmSynthesis({ target, entityType, meetingContext, window, sources, env }) {
  const bifrostUrl = env.BIFROST_BASE_URL;
  const openAiKey = env.OPENAI_API_KEY;
  const geminiKey = env.GEMINI_API_KEY;

  if (!bifrostUrl && !openAiKey && !geminiKey) {
    return null;
  }

  const dossier = sources
    .slice(0, 14)
    .map(
      (s) =>
        `[${s.id}] Title: ${s.title}\nDomain: ${s.domain} | Date: ${s.publishedDate || 'recent'} | Pillar: ${s.category}\nSummary: ${s.extractedExcerpt || s.snippet}`
    )
    .join('\n\n');

  const systemPrompt =
    'You are an elite executive pre-meeting research analyst. Using ONLY the provided numbered web sources from the last 30 days, return strictly valid JSON (no markdown fences) with keys: ' +
    'executiveSummary (string, 2-3 crisp sentences), ' +
    'findings (array of {category: "news"|"launches"|"hires"|"updates", headline: string, summary: string, publishedDate: string|null, domain: string, sourceIds: number[]}), ' +
    'discussionPoints (array of {topic: string, detail: string, sourceIds: number[]}), ' +
    'openQuestions (array of {question: string, rationale: string, sourceIds: number[]}). ' +
    'Every claim must cite valid sourceIds from the dossier.';

  const userPrompt =
    `Target: ${target} (${entityType})\n` +
    `Meeting Date: ${window.meetingDateFormatted}\n` +
    `30-Day Research Window: ${window.startDate} to ${window.endDate}\n` +
    `Meeting Context: ${meetingContext || 'General executive preparation'}\n\n` +
    `Verified Sources:\n${dossier}`;

  try {
    let rawJsonText = '';
    let engineLabel = '';

    if (bifrostUrl || openAiKey) {
      const baseUrl = (bifrostUrl || 'https://api.openai.com/v1').replace(/\/$/, '');
      const model = bifrostUrl
        ? env.BIFROST_MODEL || 'openai/gpt-4o-mini'
        : env.OPENAI_MODEL || 'gpt-4o-mini';
      const apiKey = bifrostUrl ? env.BIFROST_API_KEY || openAiKey || '' : openAiKey;

      const headers = { 'Content-Type': 'application/json' };
      if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

      const resp = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model,
          temperature: 0.2,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
        }),
      });

      if (!resp.ok) throw new Error(`Gateway HTTP ${resp.status}`);
      const json = await resp.json();
      rawJsonText = json.choices?.[0]?.message?.content || '';
      engineLabel = bifrostUrl ? `Bifrost Gateway (${model})` : `OpenAI (${model})`;
    } else if (geminiKey) {
      const model = env.GEMINI_MODEL || 'gemini-2.5-flash';
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(geminiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
            generationConfig: { temperature: 0.2, responseMimeType: 'application/json' },
          }),
        }
      );
      if (!resp.ok) throw new Error(`Gemini HTTP ${resp.status}`);
      const json = await resp.json();
      rawJsonText = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
      engineLabel = `Gemini (${model})`;
    }

    const cleaned = rawJsonText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```$/i, '')
      .trim();
    const parsed = JSON.parse(cleaned);
    const validIds = new Set(sources.map((s) => s.id));
    const filterIds = (arr) => (Array.isArray(arr) ? arr.filter((id) => validIds.has(id)) : []);

    if (!parsed.executiveSummary || !Array.isArray(parsed.findings)) {
      return null;
    }

    return {
      engine: engineLabel,
      executiveSummary: String(parsed.executiveSummary),
      findings: parsed.findings.slice(0, 10).map((f) => ({
        category: ['news', 'launches', 'hires', 'updates'].includes(f.category) ? f.category : 'news',
        headline: String(f.headline || ''),
        summary: String(f.summary || ''),
        publishedDate: f.publishedDate || null,
        domain: String(f.domain || ''),
        sourceIds: filterIds(f.sourceIds),
      })),
      discussionPoints: (parsed.discussionPoints || []).slice(0, 5).map((d) => ({
        topic: String(d.topic || ''),
        detail: String(d.detail || ''),
        sourceIds: filterIds(d.sourceIds),
      })),
      openQuestions: (parsed.openQuestions || []).slice(0, 5).map((q) => ({
        question: String(q.question || ''),
        rationale: String(q.rationale || ''),
        sourceIds: filterIds(q.sourceIds),
      })),
    };
  } catch {
    return null;
  }
}

async function runResearchAgent({
  target,
  entityType = 'auto',
  meetingDateTime,
  meetingContext = '',
  depth = 'deep',
  tavilyApiKey,
  env = process.env,
}) {
  const startedAt = Date.now();
  if (!target || !target.trim()) {
    const err = new Error('Target company or person is required.');
    err.status = 400;
    throw err;
  }
  if (!tavilyApiKey) {
    const err = new Error(
      'TAVILY_API_KEY is not configured. Add it to your .env file (or Vercel Environment Variables).'
    );
    err.status = 401;
    throw err;
  }

  const trace = [];
  const resolvedType = detectEntityType(target, entityType);
  const window = computeLookbackWindow(meetingDateTime);

  // Stage 1: Planning
  const plans = planQueries({
    target,
    entityType: resolvedType,
    meetingContext,
    startDate: window.startDate,
    endDate: window.endDate,
  });

  trace.push({
    stage: 'planner',
    status: 'completed',
    durationMs: Date.now() - startedAt,
    detail: `Planned ${plans.length} targeted queries across 30-day window (${window.startDate} → ${window.endDate}) for ${resolvedType}.`,
    queries: plans.map((p) => ({ pillar: p.pillar, topic: p.topic, query: p.query })),
  });

  // Stage 2: Parallel Tavily Search
  const searchStart = Date.now();
  const settled = await Promise.allSettled(
    plans.map((plan) =>
      callTavilySearch(tavilyApiKey, plan, {
        startDate: window.startDate,
        endDate: window.endDate,
        depth,
      })
    )
  );

  const pillarResults = [];
  let firstError = null;
  for (const outcome of settled) {
    if (outcome.status === 'fulfilled') {
      pillarResults.push(outcome.value);
    } else if (!firstError) {
      firstError = outcome.reason;
    }
  }

  if (pillarResults.length === 0 && firstError) {
    throw firstError;
  }

  // Deduplicate URLs across pillars
  const urlMap = new Map();
  let rawResultCount = 0;

  for (const pillar of pillarResults) {
    for (const r of pillar.results) {
      rawResultCount += 1;
      const canonical = canonicalizeUrl(r.url);
      if (!canonical) continue;

      if (!urlMap.has(canonical)) {
        urlMap.set(canonical, {
          url: canonical,
          domain: getDomain(canonical),
          title: r.title || getDomain(canonical),
          snippet: cleanSnippet(r.content || '', 340),
          publishedDate: r.published_date || null,
          score: typeof r.score === 'number' ? r.score : 0.5,
          pillarHint: pillar.pillar,
          extractedExcerpt: '',
          extracted: false,
        });
      }
    }
  }

  trace.push({
    stage: 'tavily_search',
    status: 'completed',
    durationMs: Date.now() - searchStart,
    detail: `Executed ${pillarResults.length}/${plans.length} Tavily searches; collected ${rawResultCount} raw results (${urlMap.size} unique verified URLs).`,
  });

  // Stage 3: Tavily Extract on top URLs (in deep mode)
  let sourcesList = Array.from(urlMap.values()).sort((a, b) => b.score - a.score);
  const extractStart = Date.now();
  let extractedCount = 0;

  if (depth === 'deep' && sourcesList.length > 0) {
    const topUrls = sourcesList.slice(0, 4).map((s) => s.url);
    const extractResp = await callTavilyExtract(tavilyApiKey, topUrls);
    const extractedMap = new Map();
    for (const item of extractResp.results || []) {
      const c = canonicalizeUrl(item.url);
      if (c && item.raw_content) {
        extractedMap.set(c, item.raw_content);
      }
    }

    for (const src of sourcesList) {
      if (extractedMap.has(src.url)) {
        src.extracted = true;
        src.extractedExcerpt = extractBestExcerpt(extractedMap.get(src.url), target);
        extractedCount += 1;
      }
    }

    trace.push({
      stage: 'tavily_extract',
      status: 'completed',
      durationMs: Date.now() - extractStart,
      detail: `Deep-extracted full article content from ${extractedCount}/${topUrls.length} top sources via Tavily Extract.`,
    });
  } else {
    trace.push({
      stage: 'tavily_extract',
      status: 'skipped',
      durationMs: 0,
      detail: 'Skipped deep extraction (Standard scan mode selected).',
    });
  }

  // Assign sequential 1-based citation IDs and classify categories
  sourcesList = sourcesList.slice(0, 16).map((src, idx) => ({
    id: idx + 1,
    ...src,
    category: classifyFindingCategory(src, src.pillarHint),
  }));

  // Stage 4: Briefing Synthesis (Optional LLM via Bifrost/OpenAI/Gemini -> Native Tavily Fallback)
  const synthStart = Date.now();
  let briefing = await callLlmSynthesis({
    target,
    entityType: resolvedType,
    meetingContext,
    window,
    sources: sourcesList,
    env,
  });

  if (!briefing) {
    briefing = buildNativeBriefing({
      target,
      entityType: resolvedType,
      meetingContext,
      window,
      pillarResults,
      sources: sourcesList,
    });
  }

  trace.push({
    stage: 'synthesizer',
    status: 'completed',
    durationMs: Date.now() - synthStart,
    detail: `Generated one-page briefing using ${briefing.engine}.`,
  });

  return {
    meta: {
      target: target.trim(),
      entityType: resolvedType,
      meetingDateTime: window.meetingIso,
      meetingDateFormatted: window.meetingDateFormatted,
      lookbackStart: window.startDate,
      lookbackEnd: window.endDate,
      windowNote: window.windowNote,
      meetingContext: meetingContext.trim(),
      depth,
      totalLatencyMs: Date.now() - startedAt,
      sourcesScanned: rawResultCount,
      uniqueSources: sourcesList.length,
      extractedCount,
      engine: briefing.engine,
      generatedAt: new Date().toISOString(),
    },
    trace,
    briefing: {
      executiveSummary: briefing.executiveSummary,
      findings: briefing.findings,
      discussionPoints: briefing.discussionPoints,
      openQuestions: briefing.openQuestions,
    },
    sources: sourcesList,
  };
}

module.exports = {
  runResearchAgent,
  computeLookbackWindow,
  detectEntityType,
};

