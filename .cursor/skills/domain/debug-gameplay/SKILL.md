---
name: debug-gameplay
description: Reproduce and fix gameplay bugs through structured playtesting and state inspection. Use when a mechanic misbehaves, feel is wrong, or a bug only appears in play mode.
---

# Debug Gameplay

## Phase 1 — Reproduce

1. Get exact steps from the reporter (or write them yourself while observing).
2. Note scene, seed, difficulty, player loadout, and input sequence.
3. Confirm the bug in editor play mode or a dev build — not only in code review.
4. If intermittent, add logging or a debug key to capture state at the failure moment.

## Phase 2 — Isolate

1. Find the authoritative owner of the failing state (see game-architecture rule).
2. Reduce the scene — disable unrelated systems or use a minimal test level.
3. Check recent diffs to scripts, resources, scene tree, and input map.
4. Distinguish logic bugs from tuning issues (values vs control flow).

## Phase 3 — Fix and verify

1. Fix the root cause — avoid masking with broad try/catch or silent defaults.
2. Re-run the original reproduction steps twice.
3. Spot-check adjacent flows (pause, death, level transition, save/load).
4. Remove or gate temporary debug prints and cheats added during investigation.

## Playtest notes template

```markdown
## Bug: <short title>
- **Scene:** 
- **Steps:** 1. … 2. …
- **Expected:** 
- **Actual:** 
- **State at failure:** (health, position, inventory, etc.)
- **Fix verified:** yes / no
```

Stop when reproduction is impossible after the fix and no new regressions appear in related systems.
