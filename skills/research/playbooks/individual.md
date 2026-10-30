# Individual playbook

Goal: find what this person lacks to reach the goals they state in public, so the ideas are products you could build for them, or for people in the same position. Work **evidence → need**. Name no product while researching.

## Guardrails (always on)
The user chose "anything public" as the source rule. That covers any public page about the person's work, goals, statements and public activity. Even when public, Qanas never collects or records:
- home address, location history, private phone numbers or private emails;
- family members, children or relationships;
- health, religion, sexual orientation, ethnicity, political opinions, or other special-category data;
- financial details beyond what they publish about their own business.

Record only what backs a need, with its source. Quote the person only on their work, goals, tools and problems. If a page mixes allowed and excluded content, take only the allowed part.

The report starts with the line "Contains personal data about <name>, from public sources, for <purpose from the brief>." Data-protection laws (GDPR, Saudi PDPL and others) treat a profile like this as personal data, so it holds only what the stated purpose needs.

## 1. Frame the person
Write four lines and save them in `00-brief.md` under "Framing":
- **Identity:** the name and the one link the user gave, plus 2–3 confirming pages (their own site, an official bio, a verified profile). If several people share the name and you cannot tell them apart from the link, stop and ask the user.
- **Role:** what they do now (job, business, creator niche, research field), from their own words.
- **Stated goals:** what they say they are trying to achieve, with sources.
- **Peers:** 3–5 people in the same role and position. Their needs are evidence too: a pain shared by peers is a market. Write the exact queries used.

## 2. Lanes (one scout per lane)

| Lane | Look for | Where | Patterns |
|---|---|---|---|
| **own-words** | Goals, frustrations, "I wish", "does anyone know a tool", repeated tasks they describe | Their site and blog, newsletter archive, LinkedIn and X posts, YouTube and podcast show notes, talks, interviews, GitHub issues and READMEs | `"<name>" interview`, `"<name>" podcast`, `site:<their-domain> <topic>`, `"<name>" "I wish" OR "struggle" OR "looking for"` |
| **work-footprint** | What they run and how: tools named, processes shown, team size, gaps in their offer (no booking, no store, manual intake forms) | Their product, shop or booking pages, link-in-bio pages, public repos, portfolio, job or gig posts they made | `"<name>" tools I use`, `<their-domain> pricing OR book OR shop`, `site:github.com <handle>` |
| **audience-voice** | What their audience asks them for again and again, and what it complains about | Comments and replies, Q&A posts, reviews of their products or courses, community threads about them | `"<name>" course review`, `"<name>" asked`, `site:reddit.com "<name>"` |
| **role-pains** | The typical pains of people in the same role and position, as evidence the need is not unique | Peers' own posts, communities for that role, freelance and job boards for that role | `<role> "biggest challenge"`, `site:reddit.com <role> "how do you"`, `<role> tools <year>` |

Run all four by default. If the person has little public footprint, say so in the verdict and lean on role-pains; label every need that rests mostly on peers as `role-wide`.

## 3. Shapes of a real personal need
- They **describe the same task as tedious** more than once, months apart.
- They **ask their audience or network for a tool** and get no good answer.
- Their **audience keeps asking for something** they don't offer.
- Their public setup shows a **manual step** where a tool is normal (a form emailed by hand, a spreadsheet as a shop).
- **Peers in the same role** complain about the same thing.

## 4. From signals to needs
Follow the Market playbook's step 4 (classify, cluster by underlying job, frequency, source skew, payer), with two changes:
1. **Peer test.** Label each need `personal` (seen only for this person) or `role-wide` (seen in 2+ peers). Ideas for a `personal` need are a service or a custom build; ideas for a `role-wide` need can be products sold to the role.
2. **Voice.** The person's own words are `first-hand`. Articles about them are `relayed`.

Personas are the person's role (PER-1) and, where relevant, their audience (PER-2), described by role, not by private details.

## 5. What good looks like
- 3–6 needs, at least 2 with first-hand signals from the person or their audience. If the evidence supports fewer, or none is above Low confidence, show what there is, give the verdict "thin", and say what is missing.
- Signals from at least 3 lanes and 4 domains.
- Every need has a peer test result.
- No excluded data anywhere in the run folder.
