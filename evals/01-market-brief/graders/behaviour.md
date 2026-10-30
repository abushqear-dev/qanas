---
type: llm
---

PASS if the agent took the type (Market) and target from the request, asked ONE batch of questions that has suggested defaults and covers at least geography or time frame and exclusions, and did not start researching before the answers.
FAIL if it started web research, wrote a Value Report, Idea List or Vision, asked for the user's team, budget, skills or time (Qanas does not use them), or asked the questions one at a time over several turns.
