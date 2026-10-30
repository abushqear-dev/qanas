# Scoring

Scores sort and make trade-offs explicit. They are not truth claims. Always show the inputs next to a total.

## Need scores (Value Report)

These are adapted from Ulwick's Outcome-Driven Innovation opportunity algorithm. ODI rates importance and satisfaction from surveys. Qanas rates them from evidence, so every rating states the evidence behind it.

### Counting rules
- Count **distinct documents and authors**, not signals. Three signals from one page are one place. The same announcement in two languages is one document.
- Count only **first-hand** signals (voice `first-hand`) toward frequency and domains. A `relayed` signal (a vendor or consultant describing customers' pain) or a `vendor` signal (marketing, pricing, help pages) can support a need but cannot by itself make it recurring.
- "Independent" means different sites and different authors, not one source quoting another.

### Frequency
- **Recurring:** the same need appears in 3+ independent places, or in 2 places at least a month apart.
- **Concentrated:** everything else with 2 or more places, including 2 places with unknown timing, and any need that clusters in one thread, one site or one week.
- **Isolated:** a single voice, however vivid. This is evidence, not a need, so it does not enter the Top needs table.
- **No first-hand signals at all:** the need is concentrated at best, and the report says "no first-hand voice found".

### Importance (1–10)
Start from 5 and adjust:

| Evidence | Change |
|---|---|
| Recurring across 4+ domains (first-hand) | +2 |
| Recurring across 2–3 domains (first-hand) | +1 |
| Signals span 6+ months | +1 |
| Severity shown by evidence: a fine actually issued, a quoted cost, lost customers, or hours per week stated in a signal | +2 |
| Severity only implied by the category (for example "compliance has legal risk") | 0 |
| Severity: annoyance only | −1 |
| Breadth: the job applies to most people in the market | +1 |
| Breadth: only a small sub-segment | −1 |
| Concentrated, not recurring | −2 |

Clamp the result to 1–10.

### Satisfaction with today's solutions (1–10)
| Evidence | Rating |
|---|---|
| No product does it. People use spreadsheets, email, paper or hire help. | 1–2 |
| Products exist, but reviews call the feature weak, costly or hard | 3–4 |
| Mixed: some leaders do it adequately, others not at all | 5–6 |
| Most leaders do it adequately, per reviews | 7–8 |
| Leaders do it well and complaints are rare | 9–10 |

If no fetched page tells you what current alternatives do for this job, set Satisfaction to 5 and label it **Assumption**. Evidence from pricing and help pages (not reviews) supports a rating, but label it **Inference**. When reviews are scarce, say so.

### Opportunity
`Opportunity = Importance + max(Importance − Satisfaction, 0)`, which ranges from 1 to 20.
- **≥ 12:** underserved. A strong candidate.
- **8–11:** worth a look.
- **< 8:** served.

A Low-confidence need is labelled at most "worth a look", whatever its total.

### Confidence (capped by frequency)
- **High:** recurring across 3+ first-hand domains, signals spread over 6+ months, and at least one signal from a review or a paid-work posting.
- **Medium:** recurring, but missing any High condition.
- **Low (hypothesis):** concentrated or without first-hand voice. The need's text says "hypothesis".

### Labels
In the Value Report, mark each statement about a need as **Fact** (a signal says it), **Inference** (your reading of several signals) or **Assumption** (no signal yet).

## Idea scores (Idea List)

Each axis is scored 1–5, with one line of reasoning each.

**Need axis, by formula:** start from the need's band (Opportunity ≥ 12 = 4, 8–11 = 3, < 8 = 1), then add 1 for High confidence, subtract 1 for Low. Clamp to 1–5. The other axes use the anchors below; use 2 and 4 for between-anchor cases.

| Axis | 1 | 3 | 5 |
|---|---|---|---|
| **Need** | see formula above | see formula above | see formula above |
| **Gap** | Crowded: several well-reviewed products already do this | Some: products exist but reviews show the gap | Open: no product found after searching in users' words |
| **Fit** | Needs skills, money or forms the profile excludes | Partly within the profile | Squarely within the profile; a small team ships v1 in weeks |
| **Reach** | No named channel, or paid ads only | A named channel that needs work to enter | A named channel the builder already has (a community, network or search they run) |
| **Money** | No payer and no willingness-to-pay signal | Payer clear, price unproven | People already pay for a worse fix (a tool, a contractor, a salaried person) |

The total is out of 25. Ties go to the idea whose need has higher confidence, because evidence is the dimension least likely to be wrong.

**Floors.** An idea ranks only if Need ≥ 3 and Gap ≥ 2 and its total is ≥ 15. Fit and Reach come from the builder profile, so they must not carry a weak need to the top: show **Evidence score** (Need + Gap + Money, out of 15) next to the total, and say so in the card when the top-ranked idea has a lower Evidence score than the runner-up.
