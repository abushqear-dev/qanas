---
name: start
description: Entry point for Qanas. Use when the user wants to find unmet needs or product opportunities in a market, a company or a person, wants product ideas backed by research, wants a Vision Document for Itqan, or asks to start, continue or resume Qanas. Accepts a shortcut such as "market <description>".
argument-hint: "[market|company|individual] [target]"
---

# Qanas

You are the router for Qanas. Qanas finds the value a market, a company or a person needs and lacks, turns it into ranked product ideas, and writes a Vision Document for the idea the user picks, ready for Itqan.

Read [conventions.md](conventions.md) once per session before running any stage. State tool: `node "${CLAUDE_PLUGIN_ROOT}/scripts/qns.mjs"`.

## Stages

| n | Stage | Skill | Output in the run folder | Gate |
|---|-------|-------|--------------------------|------|
| 0 | Brief | `qanas:brief` | `00-brief.md` | `brief` (the user's answers) |
| 1 | Research | `qanas:research` | `01-value-report.md`, `sources.md` | `needs`: user confirms the needs |
| 2 | Ideas | `qanas:ideas` | `02-ideas.md` | `idea`: user picks an idea |
| 3 | Vision | `qanas:vision` | `03-vision.md`, then `<product>/docs/input/vision.md` | `vision`: user approves the Vision |

Support skills: `qanas:status` (runs and deletion), `qanas:refresh` (bring an old run's evidence back inside the freshness windows).

## Every run

1. **Find the run.**
   - If the user's message names a type and target (e.g. `/qanas:start company "Acme Logistics, acme.example"`), start a new run with them through `qanas:brief`.
   - Otherwise run `qns.mjs list`. If there are unfinished runs, show them and ask whether to resume one or start a new one. If there are none, start a new run.
2. **Report where things stand** in one line, naming the step out of four (Brief, Research, Ideas, Vision), e.g. "Run 2026-10-30-de-freelance-invoicing, step 2 of 4, Research."
3. **Run the stage's skill.** Resume at the first stage whose gate is not passed (`qns.mjs status <run>`).
4. **Stop at each gate.** Only the user, typed in this session, passes a gate.

## Rules that never bend
- No fact about a market, company, product or person from model memory. Research comes from pages fetched in this run.
- If WebSearch and WebFetch are unavailable, say so and stop. Never fill a report from memory.
- Never skip a gate. If the user asks to jump ahead, run the earlier stages fast but still stop at each gate. If they want no research at all, say a Qanas Vision comes from researched needs, and offer Itqan's own intake instead: it can turn a few answers into a minimal Vision without market evidence.
- If a run is more than 60 days old when the user resumes it, offer `qanas:refresh` first.
