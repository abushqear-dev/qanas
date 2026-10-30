# Qanas

Qanas (قنّاص, "the hunter") is a Claude Code plugin that hunts for unmet needs.

Give it a market, a company or a person. It returns:

1. **A Value Report.** This lists the needs they have and lack, each backed by cited, dated evidence and scored.
2. **An Idea List.** This holds 5–10 product ideas that would deliver that value, ranked against your builder profile.
3. **A Vision Document** for the idea you pick. It is written to `docs/input/vision.md` and ready for [Itqan](https://github.com/abushqear-dev/itqan).

```
Brief ──► Value Report ──► Idea List ──► Vision Document ──► /itqan:start
```

## Status

This is version 0.1.0, phase 1. **Market** research works end to end. **Company** and **Individual** research are planned for phase 2. See [docs/PLAN.md](docs/PLAN.md).

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
/qanas:start market "B2B invoicing for freelancers in Saudi Arabia"
```

Or run `/qanas:start` with no argument and answer the brief.

Each run lives in `qanas/<date>-<slug>/` under the folder you start from. Your builder profile (skills, budget, the product forms you will build) is in `qanas/profile.md` and is reused across runs.

Qanas stops for your answer three times: to confirm the needs, to pick an idea, and to approve the Vision. It needs web access (WebSearch and WebFetch). Without web access it stops rather than guessing.

## License

MIT
