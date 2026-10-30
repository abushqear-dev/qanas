# Market playbook

Goal: find the jobs people in this market struggle to get done, and how badly today's products serve them. Work **evidence → need**. Name no product while researching: a named product makes you stop looking and start cherry-picking.

## 1. Frame the market
Write three lines:
- **Who:** the customer (a person or business with a role, size and region), not the industry.
- **Their words:** 5–10 terms they use for the problem and for the tools. Include local-language terms when the geography calls for it. Search in the words of the person with the problem, not the words of a market report. "Digital transformation in field services" finds consultants. `"still doing this in excel" scheduling technicians` finds the gap.
- **Comparable rule:** write the rule for choosing current alternatives before looking at any of them, as exact queries someone else could re-run. Search results are summaries, not ranked lists, so name the queries and a count. For example: "every product named in the results of `best <category> software for <who>` and `<category> alternatives`, plus every product named on 3+ fetched pages". Run the rule now. Save the **caught list** (every product it found, kept or not) in `00-brief.md` under "Comparable rule". Report both counts, how many it caught and how many you show, and name any departure from the rule.

## 2. Lanes (one scout per lane)

The lanes fail in different ways, so the overlap between them is where confidence comes from.

| Lane | Look for | Where | Patterns |
|---|---|---|---|
| **complaints** | People describing pain in their own words. 2–3★ reviews are the best: the reviewer likes the product enough to be specific about what's missing. | Reddit, Hacker News, X, niche forums, public groups, G2, Capterra, TrustRadius, Trustpilot, App Store, Play Store | `site:reddit.com <job> "workaround" OR "so annoying" OR "hate that"`, `"how do you all handle" <task>`, `"is there anything better than" <leader>`, `site:g2.com <category> "wish it" OR "doesn't support"` |
| **demand** | Where money or effort already moves: roles or gigs that exist only because a tool doesn't, heavily upvoted issues with no fix, rising search interest | Upwork, Fiverr, job boards, LinkedIn jobs, GitHub issues, Google Trends | `site:upwork.com <job>`, `hiring <role> <manual task>`, `<category> "still using spreadsheets" OR "copy paste" OR "manual process"`, `"we ended up building our own" <category>` |
| **teardown** | The leaders' own pages: pricing tiers (anything behind "Contact sales" is a segment priced out), changelogs (what they keep *not* shipping), public roadmaps and feature-request boards (votes and age) | Pricing, changelog and roadmap pages, Canny/UserVoice-style boards, help centres | `<leader> pricing`, `<leader> changelog`, `<leader> feature request <feature>`, `<leader> roadmap` |
| **change** | Recent rule, platform or standard changes that create work nobody has tooled for yet. Funding and analyst news. | Regulator sites, official gazettes, platform announcements, industry news | `<regulation or platform change> <year> <region> "how to prepare" OR compliance`, `<category> mandate deadline`, `<category> startup raises <year>` |
| **graveyard** | Negative signals: launches that got no traction, funded startups that went quiet, threads explaining why the obvious idea fails | Product Hunt, Hacker News, shutdown posts, startup post-mortems | `site:producthunt.com <category>`, `"Show HN" <category>`, `<category> startup "shutting down" OR "post-mortem"`, `"why * doesn't exist" <job>` |

Run all five by default. If the brief rules one out, say which and why. If a source blocks automated access (Reddit often does), the report must say so. Do not run the lane at reduced strength without saying so.

**Regional sources.** The list above leans toward the US and English. Qanas works in any country and language, so for the brief's region add local equivalents to each lane brief. Find them by searching for the source type in the country and language, for example `best freelance marketplaces in <country>`, `<category> forum <language>`, `<regulator> <country> official site`, plus the country's app-store reviews in the local language, classified and job sites, and news sites. Search in the local language as well as English, and tell scouts which languages to cover. Write reports in English and quote sources in their original language with a short English gloss.

**Closed platforms.** X, Telegram, WhatsApp and Facebook groups are usually unreadable. Say so in the report's gaps. If the builder's profile says their audience lives there, offer the user a way in: "paste or export a few threads and I will add them as first-hand signals".

## 3. Shapes of a real need
When you see one of these, dig in:
- The current solution is **a spreadsheet plus a recurring reminder**.
- People **pay a human** (a VA, an agency, an offshore team) to do something mechanical.
- Several companies **built the same internal tool**, and someone wrote about it.
- A feature request on a popular product has **hundreds of votes and years of silence**.
- The leader is **enterprise-priced**, leaving everyone below a certain size with nothing.
- **A rule or platform change just landed**, and the existing tools predate it.
- People **glue two tools together by hand**, the same way, every week.

## 4. From signals to needs
1. **Classify each complaint** as one of five kinds:
   - `missing`: no product does it.
   - `workaround`: people bolt something on.
   - `broken`: one vendor does it badly.
   - `support-billing`.
   - `other`.

   Only `missing` and `workaround` signals start a need. `broken` signals feed Satisfaction for that vendor's users.
2. **Cluster by the underlying job, not by the blamed feature.** A complaint about a missing export button is a need to get data into the accountant's hands. Name each need in 4–8 solution-free words, then write it as a job: verb + object + context.
3. **Label frequency** (see `scoring.md`): recurring, concentrated or isolated. An isolated vivid quote is evidence, not a need.
4. **Note source skew.** Reviewers skew negative. Vendor communities skew loyal. App stores over-index on update complaints. Job posts show what companies pay for, not what users want.
5. **Record switching triggers.** These are what pushes people away from a current product and what pulls them to another, with signals.
6. **Look for the payer.** Note paid gigs for the job, paid templates, people paying for an over-sized tool just for this, and "I'd pay for…".

## 5. What good looks like
- 5–8 needs in the Top needs table, at least 3 of them recurring. If the evidence supports fewer, show fewer, give the verdict "thin", and say what is missing.
- At least one first-hand voice per need that is not Low confidence.
- 20–60 signals from at least 4 domains and at least 3 lanes.
- 3–6 current alternatives, at least one direct, chosen by the written comparable rule.
- At least one graveyard finding, or a line saying the lane found none.
