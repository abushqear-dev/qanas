---
name: research
description: Stage 1 of Qanas. Researches the brief's market, company or person on the web through parallel scout subagents, clusters cited signals into unmet needs written as jobs, scores them (opportunity, confidence, willingness to pay) and writes the Value Report. Use when a Qanas run reaches stage 1 or the user asks what value a market, company or person needs.
---

# Stage 1: Research → Value Report

Conventions: `${CLAUDE_PLUGIN_ROOT}/skills/start/conventions.md`. Template: `${CLAUDE_PLUGIN_ROOT}/templates/value-report.md`. Input: the run's `00-brief.md`.

## 0. Check the tools
If WebSearch or WebFetch is not available, say so and stop. Do not research from memory.

## 1. Load the playbook
Read the playbook for the run's type, and [playbooks/scoring.md](playbooks/scoring.md):
- Market: [playbooks/market.md](playbooks/market.md)
- Company: [playbooks/company.md](playbooks/company.md) (it builds on the Market playbook's step 4; read that step too)
- Individual: [playbooks/individual.md](playbooks/individual.md) (same; its guardrails apply to you and to every scout)

"The playbook" below means that file. Where a step names the market, read it as the company or the person.

## 2. Frame the target
Do the playbook's step 1 yourself with a few searches, and save the framing in `00-brief.md` (under "Comparable rule" for a Market run; under "Framing" for Company and Individual runs). Show it in three or four lines and carry on. Only wait for an answer if the framing changed the target or the identity is ambiguous.

## 3. Send the scouts
Launch one `qanas:scout` subagent per lane the playbook calls for, **all in one message** so they run in parallel. Give each one:
- the type, target, geography, the first allowed content month (see conventions) and today's date;
- the framing (who, their words, the leaders the comparable rule found);
- its lane, with that lane's row from the playbook (what to look for, where, patterns) and the shapes of a real need;
- for an Individual run, the guardrails from `playbooks/individual.md`, word for word.

Wait for all of them. Do not re-fetch the scouts' pages to repeat their work. If a scout reports a blocked source, carry that into "Gaps in the research".

## 3b. Fill the critical gaps
Before clustering, ask: what single fact would most change the picture if the scouts missed it? Typical examples are a free official tool that already does the job, a regulator's own specification, or the size of the affected group. List at most three such questions and answer each with one targeted search and fetch (yourself or one extra scout). Add what you find as signals in the lane `gap-fill`. If a question stays unanswered, put it in "Gaps in the research".

## 4. Build the evidence base
1. Merge the scouts' signals. Drop duplicates by **underlying document**: the same page, the same quote reposted, or the same announcement in another language. Several signals from one page stay, but count as one place when scoring. Number them `S-1, S-2, ...`.
2. Write `sources.md`: one row per signal (ID, lane, type, class, voice, claim or quote, quote-checked, URL, domain, accessed, content date), then the alternatives the scouts named, the feature grid from the teardown lane, the skew notes and the gaps they reported.
3. Apply freshness by month:
   - Drop dated signals from before the start of the brief's time frame (compare by month).
   - Keep `live` pages (undated pricing, help or listing pages) as current on the access date. Mark them "live, undated".
   - Keep regulations that are still in force, whatever their publication date.
   - Keep `unknown`-dated posts only as supporting evidence: they cannot make a need recurring.
   - Note how many signals were dropped.
4. Spot-check three quotes: re-fetch the page of three signals marked `quote-checked yes` and confirm the quote. If one fails, remove it and spot-check three more from that scout.

## 5. Find the needs
Follow the playbook's step 4:
1. Keep `missing` and `workaround` signals as need candidates. `broken` signals feed Satisfaction.
2. Cluster by the underlying job, not the blamed feature. Give each a solution-free name and write it as `JOB-n (PER-n): verb + object + context. Outcome: Minimize the time/likelihood/effort ...`.
3. Label frequency. Isolated clusters and clusters that do not hold up go under "Rejected clusters", each with its reason.
4. Derive at most four personas from who the signals come from, in Itqan's shape: role and context, top three pains, top three gains, source. If the buyers of the strongest need are not the people named in the brief, say so in the verdict.
5. Build the Current alternatives table (`COMP-n`) from the caught list in `00-brief.md`. Include substitutes such as spreadsheets. State the rule and both counts. Regulators and mandatory government platforms are allowed as alternatives and in need names; vendor products are not.
6. Write the switching triggers and the graveyard findings.

## 6. Score and judge
1. Score every need with `scoring.md`: Importance and Satisfaction with their evidence, Opportunity, Confidence and willingness-to-pay signals. Sort by Opportunity, then Confidence.
2. Compute every score in one short script, then copy the printed values into the report. Use whichever of Node or Python is installed (check first). Do not retype or recompute a number in prose.
3. Write the **verdict** as the report's first line. Is there real, underserved value here, or is this space mostly noise? If the evidence is thin, the verdict says so. Six real needs beat ten padded ones.

## 7. Self-check before showing
Fix anything that fails:
- Every need cites at least one `S-n`; every `S-n` cited exists in `sources.md` with a URL and access date.
- Every need at Medium or High confidence is recurring, with first-hand signals from at least two independent domains. Low-confidence needs say "hypothesis". No isolated cluster is in the Top needs table. A need with no first-hand voice says "no first-hand voice found".
- No need name mentions a vendor product or a solution.
- Every quoted signal passed the spot-check or is marked `quote-checked no`; paraphrases are not in quotation marks.
- The verdict says what share of the evidence is first-hand versus relayed or vendor.
- Opportunity = Imp + max(Imp − Sat, 0) for every row.
- The summary states no market fact without an ID or a source.
- The playbook's "What good looks like" is met, or the report's "Gaps in the research" says why not.

Company and Individual runs also need: the peer test label on every need (`company-specific` or `sector`; `personal` or `role-wide`), a buyer role per need (Company), and the personal-data line at the top of the report (Individual).

## 8. Gate: confirm the needs
Write `01-value-report.md`. Run `qns.mjs check <run> research` and the `qanas:skeptic` agent as the conventions say ("Before every gate"). Then show a card:
- the verdict;
- target and number of signals, domains, lanes and alternatives;
- the Top needs table (top 5–8 rows);
- research gaps, in one line, including closed platforms that could not be read.

If no need is above Low confidence, say so on the card and recommend either a second research round on the gaps (what to look for and where) or continuing with the top needs knowing that few or no ideas will clear the idea floors.

Ask: "Which needs should I turn into ideas? Reply with IDs, 'all underserved', or tell me what to change." When the user answers, fill in the report's "Confirmed for ideas" line with their selection and the date, run `qns.mjs gate <run> needs`, and run `qanas:ideas`. Only the user's own message in this session passes the gate.
