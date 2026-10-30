---
name: refresh
description: Re-checks a past Qanas run's evidence before its Vision is used, re-fetching stale pricing, feature and sentiment sources, updating dates, and reporting what changed. Use when a run or its Vision is more than a few weeks old, before handing it to Itqan, or when the user asks to refresh or update a Qanas run.
argument-hint: "<run>"
---

# Qanas refresh

Conventions: `${CLAUDE_PLUGIN_ROOT}/skills/start/conventions.md`. State tool: `node "${CLAUDE_PLUGIN_ROOT}/scripts/qns.mjs"`.

Itqan's Discovery rules reject pricing and feature claims older than 90 days and sentiment older than 12 months. A refresh brings a run back inside those windows, or shows what no longer holds.

## 1. Find what is stale
Run `qns.mjs stale <run>`. It lists stale signals (marking the ones cited by the report or the ideas) and Vision URLs read more than 90 days ago. If nothing is stale, say so and stop.

## 2. Re-open the gates you need
The files are locked once their gate is passed. Tell the user which files will change and ask once. On their yes, run `qns.mjs reopen <run> <gate>` for the earliest file that must change (`needs` for the report and sources, `idea` for the ideas, `vision` for the Vision).

## 3. Re-fetch
For each stale cited signal, fetch its URL again:
- **Same content:** update its access date (and content date if shown).
- **Changed:** update the claim, mark it `(updated <date>)`, and note the old claim in a "Changes on refresh" section at the end of `sources.md`.
- **Gone:** search for a replacement on the same site or a peer. If none, mark the signal `gone` and remove it from the needs and ideas it supported.

Do not re-fetch uncited stale signals; drop them from `sources.md` instead and note how many.

## 4. Re-score and re-check
If any claim changed or went, re-score the affected needs and ideas with `scoring.md`, using a script. Then walk the stages again from the earliest re-opened one: `qns.mjs check`, the `qanas:skeptic` agent, and the gate with the user, exactly as in the stage skills. Show the user a short list of what changed and whether any ranking moved.

## 5. Hand off again
If the run had been handed off, ask before overwriting the product's `docs/input/vision.md`. If the product's Itqan project has already approved its Product Spec, Itqan freezes its inputs: tell the user to bring the change in through Itqan's `upstream-change` skill instead of overwriting.
