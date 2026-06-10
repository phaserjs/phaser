---
name: game-feature-workflow
description: Implement a game feature from design through playtest. Use when adding mechanics, levels, UI flows, or gameplay systems.
---

# Game Feature Workflow

## Phase 0 — Scope

1. State the player-visible outcome in one sentence.
2. Confirm whether the feature touches save/load, multiplayer, or progression — flag early if yes.
3. Identify the smallest vertical slice that proves the mechanic works.

For milestone-level scope and cut lists, use `scope-game-milestone` before starting large features.

## Phase 1 — Design slice

1. List inputs, outputs, and failure cases (edge of map, zero health, pause, disconnect).
2. Map touched scenes, scripts, assets, and config files.
3. Note tuning knobs (speed, damage, cooldown) and where they will live (resource, config, inspector).

## Phase 2 — Implement

1. Build the playable slice before polish — placeholder art and SFX are fine.
2. Wire debug hooks or cheats if they speed iteration (god mode, skip level, spawn item).
3. Keep tuning values in resources or config files, not scattered literals.
4. Add minimal player feedback (sound, flash, UI text) so playtesters can tell the feature fired.

## Phase 3 — Playtest

1. Run the feature in-editor or a dev build — not only unit tests.
2. Note feel issues, bugs, and missing feedback (audio, VFX, UI, controller rumble).
3. Record reproduction steps for any bug before attempting a fix.
4. Iterate on behavior and tuning before art polish or secondary effects.

For milestone sign-off across multiple features, use `run-playtest-session` instead of ad-hoc notes.

## Phase 4 — Integrate

- [ ] No regressions in related systems (save/load, menus, input rebinding, multiplayer if applicable)
- [ ] Performance acceptable at target scene complexity (profile if frame time spikes)
- [ ] State ownership is clear — no duplicate authoritative copies of the same data
- [ ] Debug/cheat hooks removed or gated behind dev builds
- [ ] Document non-obvious setup in README or design notes if needed

Stop when the feature is playable, tuned for the current milestone, and does not break adjacent systems.
