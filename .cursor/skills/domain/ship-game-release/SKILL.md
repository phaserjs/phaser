---
name: ship-game-release
description: Prepare and ship a milestone build. Use when cutting a release branch, exporting builds, writing release notes, or running a ship checklist.
---

# Ship Game Release

## Phase 1 — Freeze

1. Confirm feature freeze — only agreed fixes and polish remain.
2. Review cut list; remove or gate incomplete features behind flags.
3. Plan version bump per repo convention (see `game-release` rule).

## Phase 2 — Build

1. Run latest playtest pass or `run-playtest-session` if not done this milestone.
2. Run tests and lint if the repo defines them.
3. Produce release build(s) — use `run-game-project` for commands; **engine export presets and platform steps belong in the stack child skill** (e.g. `godot-export-release`).
4. Verify dev/cheat hooks are disabled or stripped from release configuration.

## Phase 3 — Verify

1. Smoke test on target platform: install, first run, main menu → gameplay → save/load → quit.
2. Check for missing assets, console errors, and placeholder content.
3. Compare against `game-release` rule checklist.

## Phase 4 — Publish

1. Write changelog or release notes (player-visible changes, known issues).
2. Tag or branch per repo convention.
3. Distribute build or submit to platform pipeline as documented in the repo.

## Ship checklist

- [ ] Feature freeze respected; cut list applied
- [ ] Version bumped and changelog written
- [ ] Release build smoke-tested on target platform
- [ ] Save/load and first-run experience verified
- [ ] No debug cheats enabled in release build
- [ ] Rollback tag or previous good build noted

Stop when the milestone build is published and documented; use `patch-game-hotfix` for urgent post-launch fixes.
