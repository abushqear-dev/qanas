---
name: brief
description: Stage 0 of Qanas. Collects the research type (Market, Company or Individual), the target, geography, time frame and exclusions, and writes the run's 00-brief.md. Use when a new Qanas run starts.
---

# Stage 0: Brief

Conventions: `${CLAUDE_PLUGIN_ROOT}/skills/start/conventions.md`. Template: `${CLAUDE_PLUGIN_ROOT}/templates/brief.md`.

## 1. Read what exists
- The user's message: take the type and target from it if given.

## 2. Ask once
One numbered batch. Each question has a suggested default in brackets; skip any the user already answered.

1. **Type:** Market, Company or Individual?
2. **Target:** the market in one phrase (who + what job + where), the company (name + website), or the person (name + one link that identifies them).
3. **Geography** [global, or the region in the target].
4. **Time frame for evidence** [last 12 months].
5. **Exclusions:** sectors, business models or ideas to rule out [none].

If the target is vague ("something in healthcare"), propose two or three sharper framings and let the user pick one.

**Company target:** ask for the website if not given; if the name is shared by several companies, ask which one.
**Individual target:** ask for one link that identifies the person and the purpose of the research (for example "products for creators like her"). Say in one line that Qanas uses public sources only and never records private contact details, family, health, religion or political views.

## 3. Write
1. Run `node "${CLAUDE_PLUGIN_ROOT}/scripts/qns.mjs" new <type> <slug> "<target>"`. It creates the run folder and `state.json`.
2. Write `00-brief.md` in the run folder from the template. Quote the user's own words under "Notes from the user". Leave "Comparable rule" for the research stage. For Individual runs, write the purpose under "Notes from the user".
3. Run `qns.mjs check <run> brief` and fix any error, then `qns.mjs gate <run> brief`. The brief is the user's own answers, so their answers in this session pass this gate.

## 4. Hand off
Say in one line what will be researched, then run `qanas:research`.
