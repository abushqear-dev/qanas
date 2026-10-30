# Company playbook

Goal: find what this company struggles with now and lacks, so the ideas are products you could sell to it, or to companies like it. Work **evidence → need**. Name no product while researching.

A company's needs show up in what it pays for, what it hires for, what its customers and staff complain about, and what it tells investors and regulators it must fix.

## 1. Frame the company
Write four lines and save them in `00-brief.md` under "Framing":
- **Identity:** legal name, website, country, sector, size (staff, revenue band if public), ownership (public, private, government). Confirm from the company's own site or a registry page. If two companies share the name, stop and ask the user which one.
- **Business model:** what it sells, to whom, and through which channels, from its own pages.
- **Peers:** 3–5 companies of similar size in the same sector and region. Their needs are evidence too (a pain shared by peers is a market, not a one-off). Write the exact queries used to find them.
- **Their words:** the terms the company and its customers use for its products, teams and problems, in the local language as well.

The **comparable rule** here applies to the products the company already uses or could buy for each need, so its categories come from the needs. Write one rule per tool category after clustering the signals and before the first search for alternatives: exact queries and a count, as in the Market playbook. Save each rule and its caught list in `00-brief.md` under "Comparable rule", in the order you wrote them.

## 2. Lanes (one scout per lane)

| Lane | Look for | Where | Patterns |
|---|---|---|---|
| **hiring** | Roles and duties that reveal gaps: manual work, new functions, tools they ask experience with, many openings for one team, repeated re-posting of the same role | Company careers page, LinkedIn jobs, Indeed, Bayt, Glassdoor jobs, local job boards | `<company> careers`, `site:linkedin.com/jobs <company>`, `<company> hiring <function>`, `<company> job "experience with"` |
| **customer-voice** | What the company's own customers complain about: service failures, missing features, slow processes | App Store and Google Play reviews of its apps, Trustpilot, Google Maps reviews, G2 or Capterra if it sells software, X replies, Reddit, local forums | `<company> reviews`, `<company> app reviews`, `<company> complaint`, `<company> "customer service"`, `site:reddit.com <company>` |
| **staff-voice** | What employees say slows them down: tools, processes, management of work | Glassdoor, Indeed company reviews, Blind, LinkedIn posts by staff | `<company> glassdoor reviews cons`, `<company> employee reviews "tools" OR "systems" OR "process"` |
| **stated-priorities** | What leadership says it must fix or build: strategy, risks, transformation programmes, regulatory duties | Annual and sustainability reports, earnings calls, investor presentations, press releases, interviews with executives, tender and procurement portals | `<company> annual report <year>`, `<company> "strategic priorities"`, `<company> CEO interview <year>`, `<company> tender <year>`, `<company> RFP` |
| **footprint** | What they already run and buy: technology stack, vendors, partners, integrations, recent incidents | Tech-stack detectors (BuiltWith, Wappalyzer pages), vendor case studies naming the company, partner pages, status pages, incident news | `<company> case study`, `"<company>" uses <category>`, `<company> outage`, `<company> data breach`, `<company> partners with` |
| **peers-and-change** | The same pains at peers, and sector changes the company must answer: new rules, competitor moves, platform shifts | Peers' reviews and job posts, regulator sites, sector news | `<peer> hiring <function>`, `<sector> regulation <year> <region>`, `<sector> <region> <year> trend` |

Run all six by default. A private company may have no investor material; then say so and lean on hiring and customer-voice.

## 3. Shapes of a real company need
- The company **hires people to do by hand** what a tool could do, or re-posts the same role again and again.
- Several job posts **name the same tool**, so a workflow depends on it. Their complaints about that tool's category matter.
- **Customers repeat the same complaint** across review sites, and the company replies with a template.
- **Leadership names a priority** (in a report, an interview or a tender) that no vendor case study shows them solving.
- A **new rule or sector change** hits them and peers alike, and their job posts show them scrambling.
- **Peers share the pain**, which makes it a market and not a one-off.

## 4. From signals to needs
Follow the Market playbook's step 4 (classify, cluster by underlying job, frequency, source skew, switching triggers, payer), with four changes:
0. **Own-service pain starts a need.** For a Company run, `support-billing` and `broken` signals about the target company's own service do start a need for that company (customers repeat the same complaint). Satisfaction for that need then comes from the tools the company could buy to fix it, not from the company's own service.
1. **Whose job.** Each job names the team or role inside the company that has it (for example "finance team closes month-end with two systems"), or its customers when the pain is customer-facing.
2. **Peer test.** For each need, note whether peers show the same signal. A need seen only at this company is labelled `company-specific`. A need seen at 2+ peers is labelled `sector`. Ideas for a `company-specific` need are a service or a custom build; ideas for a `sector` need can be products.
3. **Buyer.** Name the likely buyer and budget holder inside the company (a role, from the org signals), and whether the company buys through tenders.

Personas are roles inside the company or its customers (PER-n), not named staff.

## 5. Feature grid
A Company run has no teardown lane of its own. The feature grid that the Vision's matrix needs is built in the ideas stage: for the chosen idea's category, rate the products found by the "already solved" and "free official option" checks (Strong, Adequate, Weak or Absent, from help pages and reviews, each with URL and access date) and keep them as `ideas-filter` signals in `sources.md`.

## 6. What good looks like
- 4–8 needs, at least 2 recurring, with at least one first-hand signal each from staff, customers or the company itself. If the evidence supports fewer, or none is above Low confidence, show what there is, give the verdict "thin", and say what is missing.
- Signals from at least 4 lanes and 5 domains.
- Every need has a peer test result and a named buyer role.
- The verdict says whether the strongest needs are `sector` or `company-specific`.
