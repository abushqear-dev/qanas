---
run: <yyyy-mm-dd>-<slug>
stage: value-report
status: draft
---

# Value Report: <target>

> **Confirm this if:** the needs below are real, recurring problems for the people named, and the scores match the evidence. Trim any need you do not want ideas for.

**Verdict:** <one or two sentences: is there real, underserved value here, or is this space mostly noise? Say if the evidence is thin.>

Confirmed for ideas: <filled in at the gate: NEED-ids and date>

## Summary
<Half a page. Who has the needs, what they use today, which needs are most underserved and why. Every market fact cites a NEED-n, COMP-n or S-n. Mark inferences as such.>

## Top needs

| ID | Need (job) | Persona | Imp. | Sat. | Opportunity | Frequency | Confidence | Places (first-hand / all) | WTP signals |
|----|------------|---------|------|------|-------------|-----------|------------|---------------------------|-------------|
| NEED-1 | <solution-free name> | PER-1 | 8 | 3 | 13 | recurring | High | 4 / 7 | strong |

<Places = distinct documents or authors, not signals. WTP signals: strong (people pay now), weak (asked about or hinted), none.>

<Opportunity = Imp + max(Imp − Sat, 0). ≥ 12 underserved, 8–11 worth a look, < 8 served. Sorted by opportunity, then confidence.>

## Needs in detail

### NEED-1 <short name>
- **Job:** JOB-1 (PER-1): <verb + object + context>. Outcome: Minimize the <time | likelihood | effort> <...>. Source: S-n.
- **Importance <n>/10:** <why: frequency, severity, breadth, with signal IDs>
- **Satisfaction <n>/10:** <why: how today's alternatives fall short, with COMP-n and signal IDs>
- **Frequency and confidence:** <recurring | concentrated>, <High | Medium | Low (hypothesis)>. <Independent domains, time span, source skew.>
- **Fact / Inference:** <which statements above come straight from signals, which are your reading>
- **Willingness to pay:** <evidence people pay for workarounds, hire for it, or ask for a paid tool; or "no signal found">
- **Evidence:** S-3, S-8, S-12

## Personas
<At most four.>
- **PER-1 <name>:** <role and context>; top three pains: <...>; top three gains: <...>. Source: S-n.

## Current alternatives
Comparable rule: <the query or rule, written before looking>. Caught <n>, shown <m>. <Any departure from the rule, with the reason.>

| ID | Name | Level | What it does for these needs | URL | Accessed |
|----|------|-------|------------------------------|-----|----------|
| COMP-1 | <name> | direct | <one line> | https://example.com | 2026-01-01 |

<Level: direct, indirect, adjacent or substitute (a spreadsheet, email or paper counts as a substitute).>

## Switching triggers
- **Push away from <COMP-n or workaround>:** <what makes people leave>. S-n.
- **Pull toward <COMP-n>:** <what makes people choose it>. S-n.

## Graveyard
<Launches that got no traction, startups that went quiet, threads explaining why the obvious idea fails, each with S-n. Or "none found" with the searches run.>

## Signals
<Every signal used above. A signal is a quote or a fact from one page.>

The full table, with URLs and dates, is in `sources.md`.

| ID | Lane | Type | Class | Voice | Claim or quote | Domain | Content date |
|----|------|------|-------|-------|----------------|--------|--------------|
| S-1 | complaints | review | missing | first-hand | "<short quote>" | g2.com | 2025-11 |

<Lane: complaints, demand, teardown, change, graveyard, gap-fill, ideas-filter. Type: review, community, job-posting, freelance-gig, issue, pricing, changelog, roadmap, help-page, documentation, trend, news, regulation, launch, post-mortem. Class: missing, workaround, broken, support-billing, other. Voice: first-hand, relayed, vendor.>

## Rejected clusters
<Clusters that looked like needs but were dropped, with the reason: broken product of one vendor, support or billing complaint, one-off, too old.>

## Gaps in the research
<Sources that were unreachable, questions the evidence could not answer.>
