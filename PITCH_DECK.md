# BriefPulse — Hackathon Pitch Deck Outline

## Slide 1: Title
- **BriefPulse: Autonomous Pre-Meeting Research Agent**
- *Walk into every meeting with a verified, 30-day executive briefing in seconds.*
- Built for the **Tavily Research Agent** challenge (with optional Bifrost gateway support).

## Slide 2: The Problem
- Professionals spend **20–40 minutes** manually skimming news, press releases, LinkedIn/blogs, and funding updates before important meetings.
- Standard LLM chats suffer from **knowledge cutoffs** and **hallucinated citations**, missing critical developments from the last 30 days (new launches, exec hires, or partnerships).

## Slide 3: Our Solution — BriefPulse
- Input a **Company or Person**, **Scheduled Meeting Time**, and optional **Meeting Goal**.
- BriefPulse autonomously researches the **preceding 30 days** and outputs a **single-page, print-ready executive briefing**:
  1. **30-Day Executive Summary**
  2. **Categorized, Source-Backed Findings** (News, Launches, Hires, Market Signals) with clickable `[1]` citations
  3. **Useful Discussion Points** tailored to your meeting goal
  4. **Open Questions to Ask** based on recent developments and strategic gaps

## Slide 4: Technical Architecture
- **Frontend:** Lightweight **Bootstrap 5.3** (`index.html`) — opens directly via `file://` for demo/preview or runs live via Node.js / Vercel.
- **Backend AI Agent (`lib/agent.js` + `api/briefing.js`):**
  1. **Window & Query Planner:** Locks `[meetingDate - 30d, today]` and generates 4 specialized queries.
  2. **Parallel Tavily Search:** Calls `POST /search` across news & general topics with date bounds, deduplicating URLs.
  3. **Tavily Extract:** Calls `POST /extract` on top URLs to ground findings in full article content.
  4. **Dual-Mode Synthesizer:** Uses **Bifrost / OpenAI / Gemini** if configured, OR automatically runs our zero-extra-key **Native Tavily Grounded Synthesis Engine** using only `TAVILY_API_KEY`.

## Slide 5: Working Prototype & Demo Flow
- Live **Agent Execution Trace** in the UI shows real-time progress and latency across all 4 stages.
- Instant filtering by category (`News`, `Launches`, `Hires`, `Signals`), clickable citation jumping, **Export to Markdown**, and **One-Click Print / Save as PDF**.
- **Deployable in 1 command** on Vercel (`api/*.js` + `vercel.json`) or locally with `node server.js` using `.env`.

