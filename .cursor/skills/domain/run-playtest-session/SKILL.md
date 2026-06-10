---
name: run-playtest-session
description: Run a structured playtest session and capture findings. Use before milestone sign-off or when validating feel/balance holistically (not a single bug).
---

# Run Playtest Session

## Phase 1 — Prepare

1. State the playtest goal (milestone sign-off, new mechanic, difficulty curve, onboarding).
2. Pick build: editor play mode or latest dev build — match what players will experience.
3. Prepare a note template (see below) or issue labels for findings.

## Phase 2 — Execute

1. Play the vertical slice or full milestone path without dev cheats unless testing a specific system.
2. Record feel issues, confusion, difficulty spikes, missing feedback, and bugs.
3. Note time-to-fun, friction in menus/tutorial, and any soft-lock or progression blockers.
4. Separate tuning feedback (numbers) from logic bugs (broken behavior).

## Phase 3 — Triage

1. Group findings: ship-blocker, should-fix, nice-to-have, cut/defer.
2. For ship-blockers, open issues with reproduction steps (hand off to `debug-gameplay` per bug).
3. Summarize balance and feel themes for the team (not just a raw bug list).

## Playtest notes template

```markdown
## Playtest: <milestone or date>
- **Goal:** 
- **Build:** 
- **Player path tested:** 
- **Ship-blockers:** 
- **Feel / balance:** 
- **Polish gaps (audio, VFX, UI):** 
- **Recommendation:** ship / fix-then-retest / cut scope
```

## Exit criteria

- [ ] Goal stated and build identified
- [ ] Findings triaged with ship-blockers tracked
- [ ] Recommendation recorded for milestone sign-off

Stop when findings are captured and triaged; use `debug-gameplay` for individual bug fixes.
