# Qanas

Qanas (قنّاص, "the hunter") is a Claude Code plugin that hunts for unmet needs.

Give it a **market**, a **company** or an **individual**. It returns:

1. **A Value Report.** This lists the needs they have and lack, each backed by cited, dated evidence and scored.
2. **An Idea List.** This holds up to 10 product ideas that would deliver that value, ranked against your builder profile, with a list of the ideas it killed and why.
3. **A Vision Document** for the idea you pick. It is written to `docs/input/vision.md` and ready for [Itqan](https://github.com/abushqear-dev/itqan).

```
Brief ──► Value Report ──► Idea List ──► Vision Document ──► /itqan:start
 (you)     (research)       (you pick)    docs/input/vision.md
```

## Status

Version 0.2.0. Market, Company and Individual research all work. See [docs/PLAN.md](docs/PLAN.md) for the design.

## Install

```
/plugin marketplace add abushqear-dev/qanas
/plugin install qanas@qanas-plugins
```

To use it locally without installing:

```
claude --plugin-dir ./Qanas
```

## Use

```
/qanas:start market "B2B invoicing for freelancers in Germany"
/qanas:start company "Acme Logistics, acme.example"
/qanas:start individual "Jane Doe, https://janedoe.example"
```

Or run `/qanas:start` with no argument and answer the brief.

Each run lives in `qanas/<date>-<slug>/` under the folder you start from. Your builder profile (skills, budget, the product forms you will build) is in `qanas/profile.md` and is reused across runs.

Qanas stops for you at four gates: the brief, the needs, the idea, and the Vision. Before each gate it runs mechanical checks (`scripts/qns.mjs`) and an independent skeptic agent that re-fetches a sample of the cited pages. A hook blocks writing a stage's file before the earlier gate is passed, and editing a file once its gate is passed.

Other skills: `/qanas:status` lists runs and deletes one; `/qanas:refresh` re-checks an old run's sources before its Vision is used.

## Rules

- **No facts from memory.** Every claim has a fetched page behind it, with a URL and an access date. Without web access, Qanas stops.
- **Only first-hand voices make a need recurring.** Vendor marketing and second-hand accounts are labelled and cannot carry a need alone.
- **Individuals:** public sources about their work and goals only. Qanas never records home addresses, private contact details, family, health, religion, sexual orientation or political views. A report on a person is marked as containing personal data, and `/qanas:status` can delete it.

## Test

```
node --test tests/qns.test.mjs
claude plugin validate . --strict
claude plugin eval .
```

The evals check the brief, the no-web stop, the individual guardrails and the gate order. They use real model runs, so `claude plugin eval` needs a logged-in CLI.

## License

MIT
