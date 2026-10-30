---
name: status
description: Shows the user's Qanas runs and where each stands (type, target, stage, gates, picked idea, handoff), or deletes a run on request. Use when the user asks for Qanas status, their runs, what is left in a run, or to delete a run.
argument-hint: "[run] [--delete]"
---

# Qanas status

State tool: `node "${CLAUDE_PLUGIN_ROOT}/scripts/qns.mjs"`.

- **No run named:** run `qns.mjs list` and show the result as a short table (run, type, stage, target). Say which run is most recent and what its next step is.
- **A run named:** run `qns.mjs status <run>`, then add one line on the next step: the stage's skill, or "done: open <handoff folder> and run /itqan:start".
- **Delete:** show the run's status and ask the user to confirm deleting the whole run folder. Only after a clear yes in this session, run `qns.mjs delete <run> --yes`. Individual runs hold personal data, so mention that deleting is how to remove it.
