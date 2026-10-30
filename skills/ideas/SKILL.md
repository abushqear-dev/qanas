---
name: ideas
description: Stage 2 of Qanas. Turns the confirmed needs from the Value Report into product ideas, runs each through a "why hasn't this been built?" filter against real products on the web, scores the survivors on need, gap, fit, reach and money against the builder profile, and writes the ranked Idea List with a kill list. Use when a Qanas run reaches stage 2 or the user asks for product ideas from a Value Report.
---

# Stage 2: Ideas → Idea List

Conventions: `${CLAUDE_PLUGIN_ROOT}/skills/start/conventions.md`. Template: `${CLAUDE_PLUGIN_ROOT}/templates/ideas.md`. Scoring: `${CLAUDE_PLUGIN_ROOT}/skills/research/playbooks/scoring.md`. Inputs: `01-value-report.md` (only the needs confirmed for ideas), `sources.md`, `qanas/profile.md` and `00-brief.md`.

Every idea starts from a confirmed need and its signals. An idea that cannot be traced back to a dated signal someone could click does not belong on the list. Specific beats ambitious: "Automated VAT-return prep for Shopify sellers in the Gulf" is an idea, while "AI for accounting" is a horoscope.

## 1. Diverge
For each confirmed need, write 3–5 ideas in **different forms**:
- a tool or SaaS;
- a plugin or integration into a product people already use;
- a marketplace;
- a service (done-for-you, possibly tech-assisted);
- a data or content product.

Use two lenses:
- **Value Proposition Canvas:** which pain the idea relieves, which gain it creates, and for which persona.
- **ERRC against the current alternatives:** what the idea eliminates, reduces, raises and creates compared with `COMP-n`, the switching triggers and the graveyard.

Move anything the brief's exclusions or the profile's "won't build" rule out straight to the kill list.

**Effort.** Write 3 ideas per need, 5 at most, and no more than 12 in total. Several ideas can share one search: "Already solved?" evidence found for one idea counts for any idea it covers, so cite it again instead of repeating the search. Cap the filter at about 15 searches and 20 fetches.

## 2. Filter: why hasn't this been built?
Most obvious gaps are graveyards, and there is usually a reason nobody occupies the space. For each idea, answer each check below. Search and fetch what you cite. Add new pages to `sources.md` under lane `ideas-filter`, with their type, class `other` and voice, and number them after the last existing S-n.

Check the **free official option** first. If a regulator, platform or incumbent already offers the job for free, name it and say what is still missing. That is the most common way a top idea dies.

| Check | Kill or reframe when |
|---|---|
| **Already solved?** Search in users' words (`<job> tool`, `<idea> app`, `<leader> alternative`, Product Hunt, app stores). People who complain often haven't found the tool that exists. | Several well-reviewed products do it. Mark it **Crowded**, then kill it or reframe it toward the gap the reviews show. **Some** means products exist but reviews show the gap. **Open** means nothing was found; list the searches. |
| **Feature, not product?** | A leader could ship it in one sprint and would. |
| **Will anyone pay?** | There is no current spend: no worse tool they pay for, no contractor, no salaried person doing it by hand. |
| **Uncrossable moat?** | It needs licences, exclusive data access, exclusive integrations or a certification the builder cannot get. |
| **Cold start?** | It needs network liquidity on day one, as a two-sided marketplace does. Flag it as the harder game rather than killing it. |
| **Channel?** | Nobody can name the forum, search, community or event where these buyers already are. "Social media" is not an answer. |
| **Why now?** | Nothing changed (no new rule, platform, cost curve or audience). Then the absence of the product is evidence against it. |

Each idea's honest answer goes in its entry. "No good reason, it's just unglamorous" is often the best opportunity on the list. Keep everything you kill, with its reason: the kill list saves the user from asking about it again next week.

## 3. Shape the survivors
For each surviving idea, make these concrete:
- **The wedge:** the narrowest version that is useful to one specific person. This is the first thing worth paying for, not the platform vision.
- **Who pays and roughly how much,** anchored to what they spend on the workaround today.
- **Why now:** what changed, with a signal.
- **Unfair angle:** why a leader shipping the same feature would not crush it. The builder profile often supplies this, through language, region, network or niche skill.
- **Riskiest assumption and cheapest test:** a test the builder can run within two weeks, such as a landing page, five named-channel interviews, a concierge version or a pre-sale.

## 4. Score and rank
1. Score each survivor on the five axes in `scoring.md`, with one reason each. Fit and Reach use `qanas/profile.md`. Need uses the need's opportunity and confidence.
2. Compute the totals in a short script and copy the printed values into the report.
3. Apply the floors in `scoring.md` (Need ≥ 3, Gap ≥ 2, total ≥ 15). Ideas below a floor go to the kill list. Rank the rest by total, break ties by confidence, and show the Evidence score (Need + Gap + Money) beside the total. Keep up to 10. If fewer than five survive, show fewer and say why; never pad the list.
4. If the top idea has a lower Evidence score than the runner-up, say so on the card and name the reason it ranks first (almost always Fit or Reach).

## 5. Self-check
- Every idea serves a confirmed NEED-n and cites at least one S-n.
- Every "Already solved" answer has URLs with access dates, or lists the searches that found nothing.
- Every idea has an answer to each filter check, including the free official option and why now.
- No ranked idea breaks the brief's exclusions or the profile.
- The kill list is present.

## 6. Gate: pick an idea
Write `02-ideas.md`. Show a card with the ranking table, the pitch and biggest risk for the top three, and the kill list as one line per idea. Ask: "Which idea should become the Vision? Reply with an ID, IDs to combine, or 'another round' with what to change."

- **Another round:** generate again with the user's direction. Keep the IDs already used.
- **A pick:** set `picked`, record `gates.idea` as passed by the user today, set `stage` to 3, and run `qanas:vision`.
