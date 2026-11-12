(function () {
  'use strict';

  const CATEGORY_META = {
    news: { label: 'News', badgeClass: 'text-bg-primary', icon: 'bi-newspaper' },
    launches: { label: 'Launch', badgeClass: 'text-bg-success', icon: 'bi-rocket-takeoff' },
    hires: { label: 'Hire / Org', badgeClass: 'text-bg-warning', icon: 'bi-people' },
    updates: { label: 'Signal', badgeClass: 'text-bg-info', icon: 'bi-graph-up-arrow' },
  };

  const SAMPLE_BRIEFINGS = {
    anthropic: {
      meta: {
        target: 'Anthropic',
        entityType: 'company',
        meetingDateTime: new Date(Date.now() + 86400000).toISOString(),
        meetingDateFormatted: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
        lookbackStart: new Date(Date.now() - 29 * 86400000).toISOString().slice(0, 10),
        lookbackEnd: new Date().toISOString().slice(0, 10),
        meetingContext: 'Enterprise AI Safety & API Evaluation Sync',
        depth: 'deep',
        totalLatencyMs: 2410,
        sourcesScanned: 22,
        uniqueSources: 6,
        extractedCount: 4,
        engine: 'Sample Briefing (Demo Mode)',
      },
      trace: [
        {
          stage: 'planner',
          status: 'completed',
          durationMs: 12,
          detail: 'Planned 4 targeted queries across the preceding 30-day window for Anthropic.',
        },
        {
          stage: 'tavily_search',
          status: 'completed',
          durationMs: 1180,
          detail: 'Executed 4/4 Tavily searches; collected 22 raw results (6 unique verified URLs).',
        },
        {
          stage: 'tavily_extract',
          status: 'completed',
          durationMs: 890,
          detail: 'Deep-extracted full article content from 4/4 top sources via Tavily Extract.',
        },
        {
          stage: 'synthesizer',
          status: 'completed',
          durationMs: 328,
          detail: 'Synthesized 6 source-backed findings, 4 discussion points, and 4 open questions.',
        },
      ],
      briefing: {
        executiveSummary:
          'Over the past 30 days, Anthropic expanded its enterprise developer ecosystem with new agentic tool-use capabilities, deepened cloud distribution partnerships, and strengthened enterprise go-to-market leadership. Enterprise adoption momentum and evaluation benchmarks remain central themes ahead of your API evaluation sync.',
        findings: [
          {
            category: 'launches',
            headline: 'Expanded Agentic Tool-Use & Context Caching Improvements',
            summary:
              'Anthropic introduced lower-latency prompt caching and tighter structured-output reliability for production multi-step AI agents across API tiers.',
            publishedDate: 'Recent (30d window)',
            domain: 'anthropic.com',
            sourceIds: [1],
          },
          {
            category: 'updates',
            headline: 'Expanded Cloud Marketplace Availability & Enterprise Commitments',
            summary:
              'New enterprise procurement workflows rolled out across major cloud marketplaces, reducing legal and security review cycles for Fortune 500 engineering teams.',
            publishedDate: 'Recent (30d window)',
            domain: 'techcrunch.com',
            sourceIds: [2],
          },
          {
            category: 'hires',
            headline: 'Enterprise Go-to-Market & Solutions Architecture Expansion',
            summary:
              'Anthropic continued hiring senior enterprise solutions architects and field engineering leaders in San Francisco, New York, and London to support regulated industries.',
            publishedDate: 'Recent (30d window)',
            domain: 'reuters.com',
            sourceIds: [3],
          },
          {
            category: 'news',
            headline: 'Updated Model Evaluation & Safety Governance Reporting',
            summary:
              'Published updated third-party benchmark evaluations and Responsible Scaling Policy progress notes covering autonomous coding and cyber-safety guardrails.',
            publishedDate: 'Recent (30d window)',
            domain: 'anthropic.com',
            sourceIds: [4],
          },
        ],
        discussionPoints: [
          {
            topic: 'Prompt Caching & Multi-Turn Agent Cost Economics',
            detail:
              'Reference the latest caching and structured-output updates to ask how production workloads can reduce token cost by 40–70% on repetitive system prompts.',
            sourceIds: [1],
          },
          {
            topic: 'Cloud Marketplace Procurement Path',
            detail:
              'Align early on whether contracting directly or drawing down existing cloud commit spend accelerates security and legal sign-off.',
            sourceIds: [2],
          },
          {
            topic: 'Solutions Engineering Support During Pilot',
            detail:
              'Explore dedicated field engineering pairing given their recent expansion in enterprise solutions architecture.',
            sourceIds: [3],
          },
        ],
        openQuestions: [
          {
            question:
              'Which rate-limit tiers and batch API SLAs are available for high-throughput evaluation pipelines?',
            rationale: 'Validates production readiness beyond standard developer tiers.',
            sourceIds: [1],
          },
          {
            question:
              'How do zero-data-retention (ZDR) terms differ between direct API contracts and cloud marketplace deployments?',
            rationale: 'Surfaces compliance nuances critical for enterprise security review.',
            sourceIds: [2, 4],
          },
          {
            question:
              'What evaluation benchmarks do your solutions architects recommend for measuring real-world agent reliability?',
            rationale: 'Connects their recent safety/eval reporting to your team’s pilot KPIs.',
            sourceIds: [4],
          },
        ],
      },
      sources: [
        {
          id: 1,
          title: 'Anthropic API Updates: Agentic Tool Use & Prompt Caching',
          url: 'https://www.anthropic.com/news',
          domain: 'anthropic.com',
          publishedDate: 'Last 30 days',
          category: 'launches',
          extracted: true,
          snippet: 'Updates covering prompt caching, tool calling reliability, and developer latency improvements.',
        },
        {
          id: 2,
          title: 'Enterprise Cloud Marketplace Momentum for Frontier AI APIs',
          url: 'https://techcrunch.com',
          domain: 'techcrunch.com',
          publishedDate: 'Last 30 days',
          category: 'updates',
          extracted: true,
          snippet: 'Analysis of enterprise AI procurement moving through cloud marketplace commits.',
        },
        {
          id: 3,
          title: 'AI Labs Accelerate Field Engineering & Solutions Hiring',
          url: 'https://www.reuters.com',
          domain: 'reuters.com',
          publishedDate: 'Last 30 days',
          category: 'hires',
          extracted: true,
          snippet: 'Coverage of enterprise GTM and solutions engineering expansion across major hubs.',
        },
        {
          id: 4,
          title: 'Anthropic Research & Responsible Scaling Updates',
          url: 'https://www.anthropic.com/research',
          domain: 'anthropic.com',
          publishedDate: 'Last 30 days',
          category: 'news',
          extracted: true,
          snippet: 'Published methodology and evaluation notes on model capabilities and governance.',
        },
      ],
    },

    vercel: {
      meta: {
        target: 'Vercel',
        entityType: 'company',
        meetingDateTime: new Date(Date.now() + 86400000).toISOString(),
        meetingDateFormatted: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
        lookbackStart: new Date(Date.now() - 29 * 86400000).toISOString().slice(0, 10),
        lookbackEnd: new Date().toISOString().slice(0, 10),
        meetingContext: 'AI SDK & Serverless Deployment Partnership',
        depth: 'deep',
        totalLatencyMs: 2150,
        sourcesScanned: 18,
        uniqueSources: 4,
        extractedCount: 3,
        engine: 'Sample Briefing (Demo Mode)',
      },
      trace: [
        { stage: 'planner', status: 'completed', durationMs: 10, detail: 'Planned 4 queries for Vercel across 30-day window.' },
        { stage: 'tavily_search', status: 'completed', durationMs: 1020, detail: 'Collected 18 raw search results (4 unique URLs).' },
        { stage: 'tavily_extract', status: 'completed', durationMs: 820, detail: 'Extracted 3 primary articles via Tavily Extract.' },
        { stage: 'synthesizer', status: 'completed', durationMs: 300, detail: 'Built executive briefing with citations.' },
      ],
      briefing: {
        executiveSummary:
          'Vercel has focused heavily over the past 30 days on Fluid Compute efficiency, AI SDK developer adoption, and enterprise security/observability tooling. Positioning your integration around zero-config serverless workflows and AI agent observability aligns directly with their current product narrative.',
        findings: [
          {
            category: 'launches',
            headline: 'AI SDK & Serverless Runtime Performance Upgrades',
            summary:
              'New runtime optimizations improve cold-start latency and streaming response handling for multi-step AI agent workloads.',
            publishedDate: 'Last 30 days',
            domain: 'vercel.com',
            sourceIds: [1],
          },
          {
            category: 'updates',
            headline: 'Growing Adoption of v0 & Enterprise Frontend Cloud',
            summary:
              'Product and engineering teams are adopting AI-assisted prototyping alongside managed preview environments and firewall protections.',
            publishedDate: 'Last 30 days',
            domain: 'vercel.com',
            sourceIds: [2],
          },
          {
            category: 'news',
            headline: 'Next.js Ecosystem & Edge Middleware Enhancements',
            summary:
              'Recent releases emphasized simpler caching semantics, React Server Components diagnostics, and faster build pipelines.',
            publishedDate: 'Last 30 days',
            domain: 'nextjs.org',
            sourceIds: [3],
          },
        ],
        discussionPoints: [
          {
            topic: 'Streaming Agent Execution on Vercel Functions',
            detail:
              'Highlight how your agent architecture stays fast within serverless function execution limits using parallel search calls.',
            sourceIds: [1],
          },
          {
            topic: 'Template & Integration Ecosystem Placement',
            detail:
              'Discuss co-marketing or listing a turnkey starter template for AI developers deploying with one click.',
            sourceIds: [2, 3],
          },
        ],
        openQuestions: [
          {
            question: 'What are the key criteria for featuring new AI developer templates in the Vercel Marketplace?',
            rationale: 'Identifies distribution leverage and technical certification requirements.',
            sourceIds: [2],
          },
          {
            question: 'Which observability or gateway integrations are top requests from enterprise AI teams right now?',
            rationale: 'Reveals product roadmap gaps you can co-solve.',
            sourceIds: [1],
          },
        ],
      },
      sources: [
        {
          id: 1,
          title: 'Vercel Blog — Serverless & AI Runtime Updates',
          url: 'https://vercel.com/blog',
          domain: 'vercel.com',
          publishedDate: 'Last 30 days',
          category: 'launches',
          extracted: true,
          snippet: 'Recent announcements around AI SDK, Fluid compute, and developer experience.',
        },
        {
          id: 2,
          title: 'Vercel Changelog — Platform & Security Releases',
          url: 'https://vercel.com/changelog',
          domain: 'vercel.com',
          publishedDate: 'Last 30 days',
          category: 'updates',
          extracted: true,
          snippet: 'Monthly changelog covering Enterprise Firewall, observability, and v0 updates.',
        },
        {
          id: 3,
          title: 'Next.js Official Blog — Release Notes',
          url: 'https://nextjs.org/blog',
          domain: 'nextjs.org',
          publishedDate: 'Last 30 days',
          category: 'news',
          extracted: true,
          snippet: 'Updates on caching, server actions, and build performance.',
        },
      ],
    },

    patrick: {
      meta: {
        target: 'Patrick Collison',
        entityType: 'person',
        meetingDateTime: new Date(Date.now() + 86400000).toISOString(),
        meetingDateFormatted: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
        lookbackStart: new Date(Date.now() - 29 * 86400000).toISOString().slice(0, 10),
        lookbackEnd: new Date().toISOString().slice(0, 10),
        meetingContext: 'AI Agent Commerce & Programmable Payments Chat',
        depth: 'deep',
        totalLatencyMs: 2290,
        sourcesScanned: 16,
        uniqueSources: 3,
        extractedCount: 3,
        engine: 'Sample Briefing (Demo Mode)',
      },
      trace: [
        { stage: 'planner', status: 'completed', durationMs: 9, detail: 'Planned 4 person-focused queries for Patrick Collison.' },
        { stage: 'tavily_search', status: 'completed', durationMs: 1110, detail: 'Executed 4/4 Tavily searches; found 16 results (3 unique URLs).' },
        { stage: 'tavily_extract', status: 'completed', durationMs: 850, detail: 'Extracted 3 full articles for verification.' },
        { stage: 'synthesizer', status: 'completed', durationMs: 321, detail: 'Synthesized executive profile briefing.' },
      ],
      briefing: {
        executiveSummary:
          'Patrick Collison’s recent public commentary and Stripe product announcements continue to center on AI-native commerce, global stablecoin/cross-border rails, and developer-first financial infrastructure. Expect high interest in concrete developer velocity metrics and autonomous agent payment guardrails.',
        findings: [
          {
            category: 'news',
            headline: 'Public Commentary on AI Software Velocity & Economic Growth',
            summary:
              'In recent interviews and essays, Collison emphasized how lower software creation costs are accelerating new vertical SaaS and AI-native businesses.',
            publishedDate: 'Last 30 days',
            domain: 'stripe.com',
            sourceIds: [1],
          },
          {
            category: 'launches',
            headline: 'Stripe Billing & Usage-Based AI Metering Enhancements',
            summary:
              'Stripe expanded usage-based billing primitives tailored for AI token, API call, and outcome-based pricing models.',
            publishedDate: 'Last 30 days',
            domain: 'stripe.com',
            sourceIds: [2],
          },
          {
            category: 'updates',
            headline: 'Global Treasury & Cross-Border Infrastructure Momentum',
            summary:
              'Continued focus on faster global settlement and programmable payouts for AI platforms operating across 40+ markets.',
            publishedDate: 'Last 30 days',
            domain: 'bloomberg.com',
            sourceIds: [3],
          },
        ],
        discussionPoints: [
          {
            topic: 'Outcome & Usage-Based Metering for AI Agents',
            detail:
              'Connect your product’s unit economics directly to Stripe’s latest usage-based billing capabilities.',
            sourceIds: [2],
          },
          {
            topic: 'Frictionless Onboarding for Global AI Startups',
            detail:
              'Share concrete data on where startups lose time between API prototype and global monetization.',
            sourceIds: [1, 3],
          },
        ],
        openQuestions: [
          {
            question:
              'Where do you see the biggest trust and authorization bottlenecks before autonomous AI agents can execute commercial transactions safely?',
            rationale: 'Engages his deep interest in both developer infrastructure and financial risk controls.',
            sourceIds: [1, 2],
          },
          {
            question:
              'What billing primitives are AI-native companies asking Stripe for that do not exist cleanly yet?',
            rationale: 'Sparks a candid product strategy exchange.',
            sourceIds: [2],
          },
        ],
      },
      sources: [
        {
          id: 1,
          title: 'Stripe Newsroom & Executive Perspectives',
          url: 'https://stripe.com/newsroom',
          domain: 'stripe.com',
          publishedDate: 'Last 30 days',
          category: 'news',
          extracted: true,
          snippet: 'Recent Stripe updates on AI startups, developer economy, and global GDP.',
        },
        {
          id: 2,
          title: 'Stripe Billing — Usage-Based & AI Metering Docs',
          url: 'https://stripe.com/billing',
          domain: 'stripe.com',
          publishedDate: 'Last 30 days',
          category: 'launches',
          extracted: true,
          snippet: 'Overview of real-time metering and flexible pricing models for AI software.',
        },
        {
          id: 3,
          title: 'Global Payments & Programmable Settlement Coverage',
          url: 'https://www.bloomberg.com',
          domain: 'bloomberg.com',
          publishedDate: 'Last 30 days',
          category: 'updates',
          extracted: true,
          snippet: 'Reporting on modern payment rails and cross-border platform growth.',
        },
      ],
    },
  };

  // State
  let currentData = null;
  let activeFilter = 'all';
  let serverOnline = false;
  let serverTavilyReady = false;

  // DOM Elements
  const form = document.getElementById('briefing-form');
  const targetInput = document.getElementById('target-input');
  const entityTypeSelect = document.getElementById('entity-type-select');
  const depthSelect = document.getElementById('depth-select');
  const meetingInput = document.getElementById('meeting-datetime-input');
  const contextInput = document.getElementById('context-input');
  const windowPreview = document.getElementById('window-preview');
  const byokWrapper = document.getElementById('byok-wrapper');
  const sessionKeyInput = document.getElementById('session-key-input');
  const generateBtn = document.getElementById('generate-btn');

  const runtimeBadge = document.getElementById('runtime-status-badge');
  const envNotice = document.getElementById('env-notice');
  const envNoticeTitle = document.getElementById('env-notice-title');
  const envNoticeBody = document.getElementById('env-notice-body');
  const errorBanner = document.getElementById('error-banner');
  const errorBannerText = document.getElementById('error-banner-text');
  const loadingCard = document.getElementById('loading-card');
  const loadingStageTitle = document.getElementById('loading-stage-title');
  const loadingStageSubtitle = document.getElementById('loading-stage-subtitle');
  const traceDurationBadge = document.getElementById('trace-duration-badge');

  // Utilities
  function sanitizeUrl(rawUrl) {
    try {
      const u = new URL(rawUrl);
      if (u.protocol === 'http:' || u.protocol === 'https:') {
        return u.toString();
      }
      return '#';
    } catch {
      return '#';
    }
  }

  function showToast(message) {
    const body = document.getElementById('app-toast-body');
    const el = document.getElementById('app-toast');
    if (!body || !el || !window.bootstrap) return;
    body.textContent = message;
    const toast = bootstrap.Toast.getOrCreateInstance(el, { delay: 2600 });
    toast.show();
  }

  function formatDateTimeLocalValue(date) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  function setMeetingOffset(daysOffset) {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    if (daysOffset > 0) {
      d.setHours(10, 0, 0, 0);
    }
    meetingInput.value = formatDateTimeLocalValue(d);
    updateWindowPreview();
  }

  function updateWindowPreview() {
    const val = meetingInput.value;
    if (!val) {
      windowPreview.textContent = '';
      return;
    }
    const parsed = new Date(val);
    if (Number.isNaN(parsed.getTime())) return;
    const today = new Date();
    let start = new Date(parsed.getTime() - 30 * 86400000);
    const end = parsed > today ? today : parsed;
    if (start >= today) {
      start = new Date(today.getTime() - 30 * 86400000);
    }
    windowPreview.textContent = `30-day lookback: ${start.toISOString().slice(0, 10)} → ${end.toISOString().slice(0, 10)}`;
  }

  function createCitationPill(sourceId) {
    const a = document.createElement('a');
    a.href = `#source-card-${sourceId}`;
    a.className = 'citation-pill ms-1';
    a.textContent = `[${sourceId}]`;
    a.title = `Jump to Source ${sourceId}`;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById(`source-card-${sourceId}`);
      if (!target) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.classList.add('source-highlight');
      setTimeout(() => target.classList.remove('source-highlight'), 1800);
    });
    return a;
  }

  function renderTrace(traceList, totalLatencyMs) {
    const items = document.querySelectorAll('#agent-trace-list .trace-item');
    const byStage = new Map((traceList || []).map((t) => [t.stage, t]));

    items.forEach((li) => {
      const stage = li.getAttribute('data-stage');
      const info = byStage.get(stage);
      li.classList.remove('is-active', 'is-done', 'is-skipped');
      const detailEl = li.querySelector('.trace-detail');

      if (!info) return;
      if (info.status === 'completed') li.classList.add('is-done');
      else if (info.status === 'skipped') li.classList.add('is-skipped');

      if (detailEl && info.detail) {
        detailEl.textContent = `${info.detail} (${info.durationMs}ms)`;
      }
    });

    traceDurationBadge.textContent = totalLatencyMs ? `${(totalLatencyMs / 1000).toFixed(2)}s` : '—';
  }

  function setTraceRunning(activeStage) {
    const order = ['planner', 'tavily_search', 'tavily_extract', 'synthesizer'];
    const activeIdx = order.indexOf(activeStage);
    document.querySelectorAll('#agent-trace-list .trace-item').forEach((li) => {
      const idx = order.indexOf(li.getAttribute('data-stage'));
      li.classList.remove('is-active', 'is-done', 'is-skipped');
      if (idx < activeIdx) li.classList.add('is-done');
      else if (idx === activeIdx) li.classList.add('is-active');
    });
  }

  function renderFindings(findings) {
    const container = document.getElementById('findings-container');
    const countLabel = document.getElementById('findings-count-label');
    container.replaceChildren();

    const filtered = activeFilter === 'all'
      ? findings
      : findings.filter((f) => f.category === activeFilter);

    countLabel.textContent = `Showing ${filtered.length} of ${findings.length} findings`;

    if (filtered.length === 0) {
      const emptyCol = document.createElement('div');
      emptyCol.className = 'col-12';
      const emptyBox = document.createElement('div');
      emptyBox.className = 'p-3 border rounded-3 text-body-secondary small';
      emptyBox.textContent = 'No findings matched this category in the 30-day window.';
      emptyCol.appendChild(emptyBox);
      container.appendChild(emptyCol);
      return;
    }

    filtered.forEach((item) => {
      const col = document.createElement('div');
      col.className = 'col-12 col-md-6';

      const card = document.createElement('div');
      card.className = 'card h-100 border finding-card';

      const body = document.createElement('div');
      body.className = 'card-body p-3 d-flex flex-column';

      const topRow = document.createElement('div');
      topRow.className = 'd-flex justify-content-between align-items-center gap-2 mb-2';

      const metaInfo = CATEGORY_META[item.category] || CATEGORY_META.news;
      const badge = document.createElement('span');
      badge.className = `badge ${metaInfo.badgeClass} d-inline-flex align-items-center gap-1`;
      const icon = document.createElement('i');
      icon.className = `bi ${metaInfo.icon}`;
      badge.appendChild(icon);
      badge.appendChild(document.createTextNode(metaInfo.label));

      const dateSpan = document.createElement('span');
      dateSpan.className = 'xsmall text-body-secondary';
      dateSpan.textContent = [item.domain, item.publishedDate].filter(Boolean).join(' • ');

      topRow.appendChild(badge);
      topRow.appendChild(dateSpan);

      const headline = document.createElement('h4');
      headline.className = 'h6 fw-semibold mb-1';
      headline.textContent = item.headline;

      const summary = document.createElement('p');
      summary.className = 'small text-body-secondary mb-2 flex-grow-1';
      summary.textContent = item.summary;

      const citeRow = document.createElement('div');
      citeRow.className = 'd-flex align-items-center flex-wrap gap-1 mt-auto';
      const citeLabel = document.createElement('span');
      citeLabel.className = 'xsmall text-body-secondary';
      citeLabel.textContent = 'Sources:';
      citeRow.appendChild(citeLabel);
      (item.sourceIds || []).forEach((id) => citeRow.appendChild(createCitationPill(id)));

      body.appendChild(topRow);
      body.appendChild(headline);
      body.appendChild(summary);
      body.appendChild(citeRow);
      card.appendChild(body);
      col.appendChild(card);
      container.appendChild(col);
    });
  }

  function renderBriefing(data) {
    currentData = data;
    const { meta, briefing, sources, trace } = data;

    document.getElementById('briefing-type-badge').textContent =
      meta.entityType === 'person' ? 'Executive Briefing' : 'Company Briefing';
    document.getElementById('briefing-engine-badge').textContent = meta.engine || 'Tavily Agent';
    document.getElementById('briefing-title').textContent = meta.target;
    document.getElementById('briefing-subtitle').textContent = meta.meetingContext
      ? `Meeting Focus: ${meta.meetingContext}`
      : 'One-Page Pre-Meeting Intelligence Briefing';

    const meetingDatePretty = meta.meetingDateTime
      ? new Date(meta.meetingDateTime).toLocaleString(undefined, {
          dateStyle: 'medium',
          timeStyle: 'short',
        })
      : meta.meetingDateFormatted;

    document.getElementById('briefing-meeting-time').textContent = `Meeting: ${meetingDatePretty}`;
    document.getElementById('briefing-window-range').textContent = `30-Day Window: ${meta.lookbackStart} → ${meta.lookbackEnd}`;
    document.getElementById('briefing-metrics').textContent =
      `${meta.uniqueSources} verified sources • ${meta.extractedCount || 0} deep-extracted • ${((meta.totalLatencyMs || 0) / 1000).toFixed(1)}s`;

    document.getElementById('briefing-summary').textContent = briefing.executiveSummary;

    renderFindings(briefing.findings || []);

    // Discussion Points
    const discList = document.getElementById('discussion-points-list');
    discList.replaceChildren();
    (briefing.discussionPoints || []).forEach((dp) => {
      const li = document.createElement('li');
      const title = document.createElement('div');
      title.className = 'fw-semibold small';
      title.textContent = dp.topic;
      (dp.sourceIds || []).forEach((id) => title.appendChild(createCitationPill(id)));

      const detail = document.createElement('div');
      detail.className = 'small text-body-secondary mt-1';
      detail.textContent = dp.detail;

      li.appendChild(title);
      li.appendChild(detail);
      discList.appendChild(li);
    });

    // Open Questions
    const qList = document.getElementById('open-questions-list');
    qList.replaceChildren();
    (briefing.openQuestions || []).forEach((oq) => {
      const li = document.createElement('li');
      const qText = document.createElement('div');
      qText.className = 'fw-semibold small';
      qText.textContent = oq.question;
      (oq.sourceIds || []).forEach((id) => qText.appendChild(createCitationPill(id)));

      const rationale = document.createElement('div');
      rationale.className = 'xsmall text-body-secondary mt-1';
      rationale.textContent = `Why ask: ${oq.rationale}`;

      li.appendChild(qText);
      li.appendChild(rationale);
      qList.appendChild(li);
    });

    // Sources Ledger
    const sourcesList = document.getElementById('sources-list');
    sourcesList.replaceChildren();
    (sources || []).forEach((src) => {
      const col = document.createElement('div');
      col.className = 'col-12 col-md-6';

      const card = document.createElement('div');
      card.id = `source-card-${src.id}`;
      card.className = 'p-2 px-3 border rounded-3 source-card h-100 d-flex flex-column justify-content-between';

      const top = document.createElement('div');
      const header = document.createElement('div');
      header.className = 'd-flex align-items-center justify-content-between gap-2 mb-1';

      const numBadge = document.createElement('span');
      numBadge.className = 'badge text-bg-secondary';
      numBadge.textContent = `[${src.id}] ${src.domain}`;

      const tag = document.createElement('span');
      tag.className = 'xsmall text-body-secondary';
      tag.textContent = src.extracted ? 'Extracted' : 'Indexed';

      header.appendChild(numBadge);
      header.appendChild(tag);

      const link = document.createElement('a');
      link.href = sanitizeUrl(src.url);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.className = 'fw-medium small text-decoration-none d-block text-truncate';
      link.textContent = src.title;

      const snip = document.createElement('p');
      snip.className = 'xsmall text-body-secondary mb-0 mt-1';
      snip.textContent = src.extractedExcerpt || src.snippet;

      top.appendChild(header);
      top.appendChild(link);
      top.appendChild(snip);
      card.appendChild(top);
      col.appendChild(card);
      sourcesList.appendChild(col);
    });

    renderTrace(trace, meta.totalLatencyMs);
  }

  function buildMarkdownExport(data) {
    const { meta, briefing, sources } = data;
    const lines = [];
    lines.push(`# Pre-Meeting Briefing: ${meta.target}`);
    lines.push(`- **Entity Type:** ${meta.entityType}`);
    lines.push(`- **Scheduled Meeting:** ${meta.meetingDateFormatted}`);
    lines.push(`- **30-Day Research Window:** ${meta.lookbackStart} to ${meta.lookbackEnd}`);
    if (meta.meetingContext) lines.push(`- **Meeting Focus:** ${meta.meetingContext}`);
    lines.push(`- **Synthesis Engine:** ${meta.engine}`);
    lines.push('');
    lines.push('## Executive Summary');
    lines.push(briefing.executiveSummary);
    lines.push('');
    lines.push('## Source-Backed Findings (Last 30 Days)');
    (briefing.findings || []).forEach((f) => {
      const cites = (f.sourceIds || []).map((id) => `[${id}]`).join('');
      lines.push(`- **[${f.category.toUpperCase()}] ${f.headline}** ${cites} — ${f.summary}`);
    });
    lines.push('');
    lines.push('## Useful Discussion Points');
    (briefing.discussionPoints || []).forEach((dp) => {
      const cites = (dp.sourceIds || []).map((id) => `[${id}]`).join('');
      lines.push(`- **${dp.topic}** ${cites}: ${dp.detail}`);
    });
    lines.push('');
    lines.push('## Open Questions to Ask');
    (briefing.openQuestions || []).forEach((oq) => {
      const cites = (oq.sourceIds || []).map((id) => `[${id}]`).join('');
      lines.push(`- ${oq.question} ${cites} *(Why: ${oq.rationale})*`);
    });
    lines.push('');
    lines.push('## Verified Sources');
    (sources || []).forEach((s) => {
      lines.push(`${s.id}. [${s.title}](${s.url}) (${s.domain})`);
    });
    return lines.join('\n');
  }

  // Client-side Tavily fallback when opened directly via file:// with a session key
  async function runDirectBrowserTavily({ target, entityType, meetingDateTime, meetingContext, apiKey }) {
    const startMs = Date.now();
    const meetingDate = meetingDateTime ? new Date(meetingDateTime) : new Date();
    const today = new Date();
    const end = meetingDate > today ? today : meetingDate;
    let start = new Date(meetingDate.getTime() - 30 * 86400000);
    if (start >= today) {
      start = new Date(today.getTime() - 30 * 86400000);
    }
    const startDate = start.toISOString().slice(0, 10);
    const endDate = end.toISOString().slice(0, 10);

    const queries = [
      { category: 'news', topic: 'news', query: `"${target}" news announcement updates` },
      { category: 'launches', topic: 'general', query: `"${target}" launch release product feature` },
      { category: 'hires', topic: 'general', query: `"${target}" hired appointed leadership executive` },
      { category: 'updates', topic: 'news', query: `"${target}" partnership funding milestone` },
    ];

    setTraceRunning('tavily_search');
    const responses = await Promise.all(
      queries.map(async (q) => {
        const res = await fetch('https://api.tavily.com/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            query: q.query,
            topic: q.topic,
            search_depth: 'advanced',
            max_results: 4,
            include_answer: true,
            start_date: startDate,
            end_date: endDate,
          }),
        });
        if (!res.ok) {
          throw new Error(`Tavily API returned ${res.status}. Verify your API key.`);
        }
        const json = await res.json();
        return { ...q, answer: json.answer || '', results: json.results || [] };
      })
    );

    setTraceRunning('synthesizer');
    const urlSeen = new Set();
    const sources = [];
    const findings = [];
    const answers = [];

    responses.forEach((resp) => {
      if (resp.answer) answers.push(resp.answer);
      resp.results.forEach((r) => {
        if (!r.url || urlSeen.has(r.url)) return;
        urlSeen.add(r.url);
        const id = sources.length + 1;
        const domain = (() => {
          try {
            return new URL(r.url).hostname.replace(/^www\./, '');
          } catch {
            return 'web';
          }
        })();
        sources.push({
          id,
          title: r.title || domain,
          url: r.url,
          domain,
          publishedDate: r.published_date || 'Last 30 days',
          category: resp.category,
          extracted: false,
          snippet: (r.content || '').slice(0, 260),
        });
        if (findings.length < 8) {
          findings.push({
            category: resp.category,
            headline: r.title || domain,
            summary: (r.content || '').slice(0, 240),
            publishedDate: r.published_date || null,
            domain,
            sourceIds: [id],
          });
        }
      });
    });

    return {
      meta: {
        target,
        entityType: entityType === 'auto' ? 'company' : entityType,
        meetingDateTime: meetingDate.toISOString(),
        meetingDateFormatted: meetingDate.toISOString().slice(0, 10),
        lookbackStart: startDate,
        lookbackEnd: endDate,
        meetingContext,
        depth: 'standard',
        totalLatencyMs: Date.now() - startMs,
        sourcesScanned: sources.length,
        uniqueSources: sources.length,
        extractedCount: 0,
        engine: 'Direct Browser Tavily Mode',
      },
      trace: [
        { stage: 'planner', status: 'completed', durationMs: 8, detail: `Planned 4 queries (${startDate} → ${endDate}).` },
        { stage: 'tavily_search', status: 'completed', durationMs: Date.now() - startMs, detail: `Collected ${sources.length} verified sources.` },
        { stage: 'tavily_extract', status: 'skipped', durationMs: 0, detail: 'Run via server/Vercel for Tavily Extract.' },
        { stage: 'synthesizer', status: 'completed', durationMs: 12, detail: 'Synthesized direct browser briefing.' },
      ],
      briefing: {
        executiveSummary: answers.slice(0, 2).join(' ') || `Collected ${sources.length} recent developments for ${target}.`,
        findings,
        discussionPoints: findings.slice(0, 3).map((f) => ({
          topic: f.headline,
          detail: `Explore how this recent development impacts ${meetingContext || 'your upcoming collaboration'}.`,
          sourceIds: f.sourceIds,
        })),
        openQuestions: [
          {
            question: `What are ${target}'s top priorities following recent updates over the past 30 days?`,
            rationale: 'Aligns discussion with current operational focus.',
            sourceIds: findings[0]?.sourceIds || [],
          },
          {
            question: `Where are the biggest collaboration opportunities around ${meetingContext || 'your upcoming roadmap'}?`,
            rationale: 'Surfaces immediate next steps.',
            sourceIds: findings[1]?.sourceIds || [],
          },
        ],
      },
      sources,
    };
  }

  async function detectRuntime() {
    if (window.location.protocol === 'file:') {
      serverOnline = false;
      serverTavilyReady = false;
      runtimeBadge.className = 'badge rounded-pill text-bg-warning d-flex align-items-center gap-1 py-2 px-3';
      runtimeBadge.textContent = 'Static File Preview';
      envNotice.classList.remove('d-none');
      envNoticeTitle.textContent = 'Opened Directly via file://';
      envNoticeBody.textContent =
        'Sample briefings work immediately. To use your .env file securely, run "node server.js" or deploy to Vercel — or paste a temporary Tavily key below to test live.';
      byokWrapper.classList.remove('d-none');
      return;
    }

    try {
      const resp = await fetch('/api/health', { cache: 'no-store' });
      if (!resp.ok) throw new Error('Health endpoint unavailable');
      const health = await resp.json();
      serverOnline = true;
      serverTavilyReady = Boolean(health.tavilyConfigured);

      if (serverTavilyReady) {
        runtimeBadge.className = 'badge rounded-pill text-bg-success d-flex align-items-center gap-1 py-2 px-3';
        runtimeBadge.textContent = `Live Agent Ready • ${health.llmEngine}`;
        byokWrapper.classList.add('d-none');
      } else {
        runtimeBadge.className = 'badge rounded-pill text-bg-warning d-flex align-items-center gap-1 py-2 px-3';
        runtimeBadge.textContent = 'Server Running • Add TAVILY_API_KEY';
        envNotice.classList.remove('d-none');
        envNoticeTitle.textContent = 'TAVILY_API_KEY Missing in .env';
        envNoticeBody.textContent =
          'Add TAVILY_API_KEY=tvly-... to your .env file and restart the server, or enter a temporary session key below.';
        byokWrapper.classList.remove('d-none');
      }
    } catch {
      serverOnline = false;
      serverTavilyReady = false;
      runtimeBadge.className = 'badge rounded-pill text-bg-secondary d-flex align-items-center gap-1 py-2 px-3';
      runtimeBadge.textContent = 'Static Mode';
      byokWrapper.classList.remove('d-none');
    }
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    errorBanner.classList.add('d-none');

    if (!targetInput.value.trim()) {
      form.classList.add('was-validated');
      targetInput.focus();
      return;
    }

    const payload = {
      target: targetInput.value.trim(),
      entityType: entityTypeSelect.value,
      meetingDateTime: meetingInput.value ? new Date(meetingInput.value).toISOString() : new Date().toISOString(),
      meetingContext: contextInput.value.trim(),
      depth: depthSelect.value,
    };

    const sessionKey = sessionKeyInput.value.trim();

    if (!serverOnline && !sessionKey) {
      errorBannerText.textContent =
        'To run live research, either start the backend with .env ("node server.js" / Vercel) or enter a session Tavily API key.';
      errorBanner.classList.remove('d-none');
      return;
    }

    generateBtn.disabled = true;
    loadingCard.classList.remove('d-none');
    setTraceRunning('planner');
    loadingStageTitle.textContent = `Researching ${payload.target}...`;
    loadingStageSubtitle.textContent = 'Stage 1/4: Planning 30-day lookback queries across news, launches, hires, and signals.';

    const stageTimer1 = setTimeout(() => {
      setTraceRunning('tavily_search');
      loadingStageSubtitle.textContent = 'Stage 2/4: Executing parallel Tavily Search queries across the live web...';
    }, 450);

    const stageTimer2 = setTimeout(() => {
      if (payload.depth === 'deep') {
        setTraceRunning('tavily_extract');
        loadingStageSubtitle.textContent = 'Stage 3/4: Deep-reading top sources with Tavily Extract...';
      }
    }, 1700);

    try {
      let result;
      if (serverOnline) {
        const headers = { 'Content-Type': 'application/json' };
        if (sessionKey) headers['X-Tavily-Key'] = sessionKey;
        const resp = await fetch('/api/briefing', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });
        const json = await resp.json();
        if (!resp.ok) {
          throw new Error(json.error || `Server error (${resp.status})`);
        }
        result = json;
      } else {
        result = await runDirectBrowserTavily({ ...payload, apiKey: sessionKey });
      }

      activeFilter = 'all';
      updateFilterButtons();
      renderBriefing(result);
      showToast(`Briefing ready for ${result.meta.target}`);
    } catch (err) {
      const msg =
        !serverOnline && err instanceof TypeError
          ? 'Browser blocked direct cross-origin API call from file://. Run "node server.js" locally (or deploy to Vercel) with TAVILY_API_KEY in .env.'
          : err.message || 'Unable to generate briefing.';
      errorBannerText.textContent = msg;
      errorBanner.classList.remove('d-none');
    } finally {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      loadingCard.classList.add('d-none');
      generateBtn.disabled = false;
    }
  }

  function updateFilterButtons() {
    document.querySelectorAll('.filter-btn').forEach((btn) => {
      const isMatch = btn.getAttribute('data-filter') === activeFilter;
      btn.classList.toggle('btn-primary', isMatch);
      btn.classList.toggle('active', isMatch);
      btn.classList.toggle('btn-outline-secondary', !isMatch);
    });
  }

  function initTheme() {
    const saved = localStorage.getItem('bp-theme') || 'light';
    applyTheme(saved);
    document.getElementById('theme-toggle-btn').addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-bs-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('bp-theme', next);
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
    const icon = document.getElementById('theme-icon');
    if (icon) {
      icon.className = theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon-stars';
    }
  }

  function init() {
    initTheme();
    setMeetingOffset(1);
    renderBriefing(SAMPLE_BRIEFINGS.anthropic);
    detectRuntime();

    meetingInput.addEventListener('change', updateWindowPreview);

    document.querySelectorAll('.preset-time').forEach((btn) => {
      btn.addEventListener('click', () => {
        const offset = Number(btn.getAttribute('data-offset-days') || 0);
        setMeetingOffset(offset);
      });
    });

    document.querySelectorAll('.sample-trigger').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-sample');
        const sample = SAMPLE_BRIEFINGS[key];
        if (!sample) return;
        targetInput.value = sample.meta.target;
        entityTypeSelect.value = sample.meta.entityType;
        contextInput.value = sample.meta.meetingContext;
        activeFilter = 'all';
        updateFilterButtons();
        renderBriefing(sample);
        showToast(`Loaded sample briefing: ${sample.meta.target}`);
      });
    });

    document.querySelectorAll('.filter-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeFilter = btn.getAttribute('data-filter') || 'all';
        updateFilterButtons();
        if (currentData) {
          renderFindings(currentData.briefing.findings || []);
        }
      });
    });

    document.getElementById('copy-md-btn').addEventListener('click', async () => {
      if (!currentData) return;
      try {
        await navigator.clipboard.writeText(buildMarkdownExport(currentData));
        showToast('Markdown briefing copied to clipboard.');
      } catch {
        showToast('Clipboard permission denied; try Export .md instead.');
      }
    });

    document.getElementById('download-md-btn').addEventListener('click', () => {
      if (!currentData) return;
      const md = buildMarkdownExport(currentData);
      const slug = currentData.meta.target.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `briefing-${slug || 'meeting'}.md`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast('Downloaded Markdown briefing.');
    });

    document.getElementById('print-btn').addEventListener('click', () => {
      window.print();
    });

    form.addEventListener('submit', handleFormSubmit);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
