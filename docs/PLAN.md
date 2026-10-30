# Qanas: plan

Qanas (قنّاص, "the hunter") is a Claude Code plugin that hunts for unmet needs. You give it a market, a company or a person. It returns the value they need and lack, a ranked list of products that would deliver that value, and, for the one you pick, a Vision Document that Itqan takes as its input.

```
Brief ──► Value Report ──► Idea List ──► Vision Document ──► Itqan (/itqan:start)
 (you)     (research)       (you pick)    docs/input/vision.md
```

## 1. Decisions already made

| Decision | Choice | Effect |
|---|---|---|
| Value lens | **Their unmet need** | For a company or a person, Qanas finds what they lack or struggle with. The ideas are products you could build and sell to them, or to others like them. |
| Sources on individuals | **Anything public** | Any public web source, including social posts and forums. See the guardrails in §6. |
| Output language | **English** | Matches Itqan's templates and voice. |
| Target | **Itqan 0.8.x** | The Vision must pass Itqan intake. Its evidence appendix is shaped like Itqan's Discovery document, so Discovery (which runs only at the Full product scale) can start from it instead of redoing the research. |

## 2. What Itqan needs from Qanas (the contract)

These come from the installed Itqan 0.8.3 (`skills/intake`, `skills/discovery`, `templates/discovery.md`):

- **File:** `docs/input/vision.md` in the product project. Intake classifies it as `vision` and records it with `itq.mjs record-input`.
- **Minimum content:** who it is for, the problem, the three things it must do, what is out of scope, and hard constraints.
- **Discovery head start:** Itqan skips Discovery at Prototype, Demo and MVP, and runs it at Full product, where it can use `light` mode "when the inputs already contain a market analysis". It still needs a feature matrix (Kano classes, 60% table-stakes rule), personas, jobs, positioning, and the user's rulings. So the Vision gets a cited **Market evidence** appendix written to Discovery's rules and shapes: every claim has a URL and an ISO access date, pricing and features are under 90 days old, sentiment is under 12 months old, and a claim needs two independent domains or it is marked a hypothesis. The appendix gives Discovery a head start; it does not replace it.
- **IDs that map across:** Qanas personas, jobs and competitors use Itqan's shapes (`PER-n`, `JOB-n` with an `Outcome: Minimize …` line, `COMP-n` with a level of direct, indirect, adjacent or substitute). Discovery can then cite them directly.
- **Scale hint:** the Vision proposes an Itqan scale (Prototype, Demo, MVP or Full) with one line of reasoning. Itqan still asks the user to choose.
- **Voice:** plain and short. Active voice. No marketing. This is Itqan's convention.

Qanas never writes into `.itqan/` and never runs `itq.mjs`. The handoff ends at the Vision file plus "run `/itqan:start` in that folder".

## 3. The workflow

Each stage writes one file in a run folder. It shows a short card and waits for you before going on, so you can stop, adjust or resume at any point.

### Stage 0: Brief (`qanas:brief`)

One batch of questions, each with a default:

1. **Research type:** Market, Company or Individual.
2. **Target:** the market (for example "independent dental clinics in the GCC"), the company (name plus website), or the person (name plus one disambiguating link).
3. **Geography and time frame**, if they matter.
4. **Builder profile**, saved once and reused: your skills, team size, budget, and the product forms you will and won't build (SaaS, mobile, service, marketplace, hardware). This is what keeps the ideas buildable by you.
5. **Exclusions:** sectors, business models, or anything you already ruled out.

Output: `00-brief.md`.

### Stage 1: Research → Value Report (`qanas:research`)

The goal is a short list of **needs**. Each need is written as a job with a desired outcome, backed by evidence and scored.

**Research playbooks.** There is one per type, kept as reference files the skill loads:

| Type | Where needs show up | Main sources |
|---|---|---|
| **Market** | Recurring complaints, workarounds, "how do I…" questions, hiring for manual work, bad reviews of category leaders, regulation that creates new duties | 1–3★ reviews (G2, Capterra, app stores, Trustpilot), Reddit and niche forums, Upwork/Fiverr and job boards (repeated manual jobs mean no tool exists), Google Trends, industry reports, regulator sites, Product Hunt and launch sites for recent entrants |
| **Company** | What the company struggles with now | Job postings (roles and tools they hire for = gaps), their own reviews (Glassdoor, G2 if they sell software, app-store reviews), support forums and status pages, earnings calls and annual reports (stated priorities and risks), press and news, their tech stack (BuiltWith-style signals), complaints by their customers, competitor moves they must answer |
| **Individual** | What the person lacks to reach their goals | Their own site, posts and talks (stated goals and frustrations), questions they ask in public, tools they use or complain about, their role and its typical pains, their audience's requests to them |

**Method:**

1. **Collect signals.** Each signal is a quote or fact with its URL and access date.
2. **Cluster** the signals into needs. Sort complaints into "broken product", "bad support or billing" and "genuinely missing". Only "missing" and "workaround" signals become needs.
3. **Write each need as a job** in Itqan's form: `JOB-n (PER-n): verb + object + context. Outcome: Minimize the time/likelihood/effort …`.
4. **Score each need.** This is an evidence-based adaptation of Ulwick's Outcome-Driven Innovation opportunity score:
   - **Importance (1–10)** from frequency, severity and breadth of the signals.
   - **Satisfaction (1–10)** with today's solutions, from reviews and workarounds.
   - **Opportunity = Importance + max(Importance − Satisfaction, 0)**, which gives a range of 1–20. Treat ≥ 12 as underserved and 8–12 as worth a look. These cut-offs are heuristics, so the report shows the inputs and not just the total.
   - **Confidence:** High (two or more independent domains and recurring over time), Medium, or Low (one source, so it is labelled a hypothesis).
   - **Willingness-to-pay signals**, listed but not scored: people already paying for workarounds, hiring for it, or asking "is there a paid tool…".
5. **Run the skeptic pass.** The `qanas:skeptic` agent re-reads every claim against its source. It flags single-source claims, stale dates, loud-but-rare complaints, and needs that are really a bad competitor rather than a gap.

Output: `01-value-report.md`. It holds a one-page summary, the top needs table (need, opportunity, confidence, evidence count), a short entry per need, personas, the current alternatives (`COMP-n`), and sources.

**Gate:** you confirm or trim the needs list before ideas are generated.

### Stage 2: Ideas → Idea List (`qanas:ideas`)

1. **Diverge.** For each top need, generate 3–5 product ideas in different forms: tool, SaaS, marketplace, service, plugin or integration, content or data product. Use the Value Proposition Canvas (pains → pain relievers, gains → gain creators) and Blue Ocean ERRC (eliminate, reduce, raise, create) against the current alternatives.
2. **Quick reality check per idea.** Search for existing products that already do it. Each idea gets a `Crowded`, `Some` or `Open` label with links. Ideas that already exist with good reviews are dropped or reframed.
3. **Score** each surviving idea from 1 to 5 on five axes, with one line of reasoning each:
   - **Need strength:** taken from the need's opportunity score and confidence.
   - **Gap:** how poorly existing products cover it.
   - **Fit:** how well it matches the builder profile from the brief.
   - **Reachability:** how easy it is to find and reach the buyer.
   - **Monetization:** whether there is a clear payer and evidence of willingness to pay.
4. **Rank and present** 5–10 ideas. Each gets one line of pitch, the need it serves, who pays, its form, its score breakdown, its biggest risk, and the cheapest test (a landing page, five interviews, a concierge version).

Output: `02-ideas.md`.

**Gate:** you pick one idea, combine ideas, or ask for another round.

### Stage 3: Vision Document (`qanas:vision`)

The Vision is written from the chosen idea, its need and its evidence, with Itqan's intake fields first:

```
# Vision: <product name>
Source: Qanas run <slug>, <date>

## Who it is for            (PER-n, with role and context)
## The problem              (JOB-n and outcomes, with evidence links)
## What it must do          (exactly three core capabilities, plus a "later" list)
## Out of scope             (explicit list)
## Hard constraints         (platform, budget, data, legal, from brief and research)
## Why now and why us       (trend, regulation, builder fit)
## Success looks like       (2–4 measurable outcomes)
## Suggested Itqan scale    (one line of reasoning; Itqan still asks)
## Appendix A: Market evidence   (COMP-n table, needs table, cited and dated to Discovery's rules)
## Appendix B: Assumptions and open questions
```

Then you approve it, and it is written to `<product folder>/docs/input/vision.md`. You name the product folder, and Qanas creates it if needed. Qanas then tells you to run `/itqan:start` there.

### Support skills

- `qanas:start`: the router. It reads the run state, resumes at the first unfinished stage, and accepts a shortcut such as `/qanas:start market "B2B invoicing for freelancers in Germany"`.
- `qanas:status`: lists runs and where each one stands.
- `qanas:refresh`: re-checks a past run's sources and dates before its Vision is used, because evidence older than 90 days fails Itqan Discovery.

## 4. Plugin layout

This follows the official Claude Code plugin layout (manifest only in `.claude-plugin/`, components at the root) and mirrors how the Itqan repo is published, with a single-plugin marketplace at the repo root:

```
Qanas/
├── .claude-plugin/
│   ├── plugin.json
│   └── marketplace.json          # { "plugins": [{ "name": "qanas", "source": "./" }] }
├── skills/
│   ├── start/SKILL.md            # router + conventions.md
│   ├── brief/SKILL.md
│   ├── research/
│   │   ├── SKILL.md
│   │   └── playbooks/market.md, company.md, individual.md, scoring.md
│   ├── ideas/SKILL.md
│   ├── vision/SKILL.md
│   ├── status/SKILL.md
│   └── refresh/SKILL.md
├── agents/
│   ├── scout.md                  # web researcher: WebSearch/WebFetch, returns cited signals only
│   └── skeptic.md                # read-only verifier of claims, sources, dates and scores
├── templates/
│   ├── brief.md, value-report.md, ideas.md, vision.md
├── scripts/
│   └── qns.mjs                   # state + checks (no dependencies, Node)
├── hooks/hooks.json              # phase 2: block out-of-order writes in a run folder
├── evals/                        # phase 3
├── docs/PLAN.md
└── README.md
```

**Run folder**, created in the directory where you invoke Qanas:

```
qanas/<yyyy-mm-dd>-<slug>/
  state.json          # type, target, stage, approvals (owned by qns.mjs)
  00-brief.md
  01-value-report.md
  02-ideas.md
  03-vision.md        # copied to <product>/docs/input/vision.md at handoff
  sources.md          # every URL with access date and the claims it backs
```

The builder profile lives in `qanas/profile.md`. It is shared by all runs and asked for only once.

**Research fan-out.** The research stage sends 3–5 `scout` subagents in parallel. They split by source family (reviews, communities, jobs, news and filings, trends). Each returns signals as `claim | quote | url | accessed | source-type`. This keeps raw pages out of the main context, so the main thread only clusters and scores.

## 5. Quality rules (adapted from Itqan Discovery)

1. **No market fact from model memory.** Every fact comes from a page fetched in this run.
2. **A claim is a sentence with a source:** a URL and an ISO access date.
3. **Two independent domains** are needed before a need or gap is called confirmed. Otherwise it is a hypothesis.
4. **Freshness:** features and pricing are at most 90 days old, and sentiment is at most 12 months old.
5. **Evidence over marketing:** ratings come from reviews and help pages, not landing pages.
6. **If web access is unavailable, stop and say so.** Never fill the report from memory.
7. **`qns.mjs check <stage>`** enforces the mechanical parts: required sections, every table row has a URL and date, scores are within range, opportunity math is correct, at least N needs, and the Vision has the five intake fields and three capabilities.

## 6. Individual research guardrails

You chose "anything public". Qanas will use any public source about the person's work, goals and public statements. To keep this from becoming a dossier, Qanas will not collect or record, even if public:

- home address, phone numbers, personal emails, or location history
- family members, children or relationships
- health, religion, sexual orientation, political views, or other special-category data
- financial details beyond what they publish about their business

It also stores only what backs a need, with the source. The report states that it contains personal data, and the run can be deleted with `qanas:status --delete <run>`. Where data-protection laws (GDPR, CCPA and similar laws elsewhere) apply, a profile like this is personal data, so the guardrails keep it to what is necessary for the stated purpose.

## 7. Build phases

| Phase | Scope | Done when |
|---|---|---|
| **1. Walking skeleton (done, v0.1)** | `plugin.json`, `marketplace.json`, the `start`, `brief`, `research`, `ideas` and `vision` skills, the four templates, the `scout` agent, and the Market playbook | One Market run goes from brief to `docs/input/vision.md`, and Itqan intake records the result as `vision` without questions |
| **2. All types and rigor (done, v0.2)** | Company and Individual playbooks, the `skeptic` agent, `qns.mjs` (state and checks), the stage-order hook, `status` and `refresh` | Company and Individual runs pass `qns.mjs check`, and Itqan Discovery accepts `Mode: light` from the appendix |
| **3. Evals and publish** | `evals/` covering one market, one company and one person, plus no-web-access and stale-source cases. Also a README, `claude plugin validate --strict`, and a GitHub push and marketplace install test | The evals pass, and the plugin installs from GitHub on a clean machine |

## 8. Open points (defaults chosen, change them if you disagree)

- **Run folder location:** `./qanas/` in the current directory. The alternative is a fixed workspace folder set in `userConfig`.
- **Number of ideas shown:** 5–10 after filtering.
- **Approvals:** three, for the needs list, the idea pick and the Vision. A `--fast` flag could collapse the first one.
- **Plugin dependency on Itqan:** none. Qanas only writes a file Itqan reads, so either plugin works alone.

## Sources consulted for this plan

- Itqan 0.8.3, installed locally: `skills/intake`, `skills/discovery`, `templates/discovery.md`, `skills/start/scales.md`, `.claude-plugin/marketplace.json`
- Claude Code plugin manifest reference: https://code.claude.com/docs/en/plugins-reference (accessed 2026-10-30)
- Outcome-Driven Innovation (opportunity algorithm): https://en.wikipedia.org/wiki/Outcome-Driven_Innovation and https://strategyn.com/quantify-your-customers-unmet-needs (accessed 2026-10-30)
- Finding unmet needs without a study (workarounds, "how do I" questions, churn reasons): https://www.enterpret.com/guides/the-5-ways-to-find-unmet-customer-needs-without-running-a-research-study (accessed 2026-10-30)
- Recurrence over virality for community signals: https://dev.to/jack_195bdce3b573b46d5e64/find-product-pain-points-on-reddit-a-step-by-step-guide-33fb (accessed 2026-10-30)
