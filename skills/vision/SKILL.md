---
name: vision
description: Stage 3 of Qanas. Writes a Vision Document for the idea the user picked, with the fields Itqan intake asks for and a cited market-evidence appendix shaped like Itqan's Discovery document, then hands it off as docs/input/vision.md in the product folder. Use when a Qanas run reaches stage 3 or the user asks for a Vision Document from a Qanas idea.
---

# Stage 3: Vision Document

Conventions: `${CLAUDE_PLUGIN_ROOT}/skills/start/conventions.md`. Template: `${CLAUDE_PLUGIN_ROOT}/templates/vision.md`. Inputs: the picked idea in `02-ideas.md`, the needs it serves in `01-value-report.md`, `sources.md`, `00-brief.md`, `qanas/profile.md`.

## Why the format matters
Itqan intake reads `docs/input/vision.md`. It needs: who it is for, the problem, the three things it must do, what is out of scope, and hard constraints.

Itqan's Discovery stage runs only at the **Full product** scale (it is skipped at Prototype, Demo and MVP). At Full product, Discovery can run in `light` mode when the inputs already contain a market analysis, and it then reads that analysis first and cites it. It still needs, in its own shapes: 1–5 competitors with URL and date, a feature matrix with Kano classes and the 60% table-stakes rule, personas and jobs, and positioning. It also asks the user to rule on every table-stakes feature. So Appendix A is written to Discovery's research rules and shapes to give it a head start. It does not replace Discovery or its rulings.

At the other scales, Appendix A is the Vision's evidence section: it tells Itqan's Constitution and Product Spec which features users already expect.

## 1. Draft
Fill every template section from the inputs. Only what the inputs support; anything else is an assumption (`A-n`, with its consequence) or an open question (`Q-n`).
- **Product name:** a short working name. Say it is a working name.
- **Who it is for / The problem:** carry `PER-n` and `JOB-n` over from the Value Report in the same shape (role and context, top three pains, top three gains, source; job with outcome and source). Replace `S-n` with the URL and access date, so the Vision stands alone.
- **What it must do:** exactly three capabilities that together make the idea's wedge, judged against the job's outcome. Everything beyond the wedge goes to "Later".
- **Out of scope:** at least three explicit exclusions, including the obvious next features you deferred.
- **Hard constraints:** from the brief (geography, exclusions), the profile (forms, budget, skills) and the research (regulation, platforms people already use). Every technical or legal constraint that comes from the research cites a source. Prefer the regulator's or platform's own specification over a secondary site. A constraint resting on one secondary domain says "hypothesis: verify against <the primary source>".
- **Suggested Itqan scale:** Prototype to test the idea, Demo to show it, MVP for first real users, Full product to ship and keep. Pick from the profile's goal and the idea's cheapest test. Add one line saying which Itqan stages that scale runs, so the user knows whether Discovery will run. From Itqan 0.8 (`F` full, `L` lite, `-` skipped; check `itq.mjs scale list` in case it changed):

  | Scale | Discovery | Constitution | Spec | UX | Tech design | Plan | Build | Acceptance |
  |---|---|---|---|---|---|---|---|---|
  | Prototype | - | - | L | - | - | L | L | L |
  | Demo | - | - | L | L | - | L | L | L |
  | MVP | - | L | F | L | L | F | L | L |
  | Full product | F | F | F | F | F | F | F | F |
- **Appendix A:** build it from `sources.md` and the Idea List:
  - the competitor table (`COMP-n`, with a "what it does" column);
  - the needs table with sources;
  - the **feature matrix** in Itqan's shape: one row per feature from the teardown lane's feature grid (Market runs) or from the ideas-filter ratings (Company and Individual runs, which have no teardown lane), one column per competitor, each cell a rating with a URL and access date in parentheses, a Kano class, and a table-stakes column (yes when present in at least 60% of the listed competitors). A feature seen on fewer than two domains is a hypothesis;
  - the rulings the user will be asked to make, as `pending`.
  Re-check dates against today; refresh or mark anything stale.
- **Appendix B:** carry over the idea's riskiest assumption and cheapest test.
- **Individual runs:** describe people by role. The Vision goes into another project, so it carries no personal data about the target beyond their public name, and only if the product is built for them.

## 2. Self-check
- The five intake fields are present and non-empty. "What it must do" has exactly three items.
- Every `COMP-n`, `PER-n` and `JOB-n` keeps the meaning it had in the Value Report and Idea List.
- Every URL in Appendix A and in the constraints has an access date. Pricing and feature claims are within 90 days, with `live, undated` pages counted as read on their access date. Sentiment is within 12 months. Regulations count while in force.
- Every need in Appendix A at Medium or High confidence has two different domains in its sources. The rest say "hypothesis".
- The feature matrix applies the 60% rule to the competitors listed, and says how many that is.
- No hype words (revolutionary, seamless, cutting-edge, powerful, game-changing).
- Nothing in the Vision contradicts the brief's exclusions or the profile.

## 3. Gate: approve the Vision
Write `03-vision.md`. Run `qns.mjs check <run> vision` and the `qanas:skeptic` agent as the conventions say ("Before every gate"). Show a card: the one-paragraph summary, the three capabilities, out of scope, the suggested scale and which stages it runs, the count of assumptions and open questions, and the riskiest assumption. Ask: "Do you approve this Vision? Reply approve, or tell me what to change." Only the user's own message in this session counts as approval.

## 4. Hand off
Only after the user approves:
1. Run `qns.mjs gate <run> vision`.
2. Ask where the product project lives [`../<product-slug>` next to the current folder].
3. Run `qns.mjs handoff <run> <product-folder>`. It copies the Vision unchanged and refuses to overwrite an existing `docs/input/vision.md`; in that case show the existing file's first lines and re-run with `--force` only if the user agrees. Do not create `.itqan/` or run any Itqan command.
4. Tell the user: open that folder and run `/itqan:start`. Itqan will record the Vision and ask for the scale. If they choose Full product, Discovery can start from Appendix A.
