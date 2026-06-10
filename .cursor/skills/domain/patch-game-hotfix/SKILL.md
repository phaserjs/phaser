---
name: patch-game-hotfix
description: Ship a minimal post-release fix. Use for hotfixes, balance patches, or critical gameplay regressions after launch.
---

# Patch Game Hotfix

## Phase 1 — Triage

1. Confirm severity: crash, progression blocker, exploit, or balance-only.
2. Reproduce on the **released** build version when possible.
3. Decide patch scope — smallest change that fixes the issue without new features.

## Phase 2 — Fix

1. Branch from the release tag or hotfix branch per repo convention.
2. Fix root cause; avoid drive-by refactors or scope creep.
3. Add or update a regression check (test, scene, or documented manual step).
4. Bump patch version per `game-release` rule.

## Phase 3 — Ship

1. Run smoke test: install upgrade path or fresh install if save format changed.
2. Verify save compatibility or document breaking save warning in patch notes.
3. Build and publish via `ship-game-release` checklist (abbreviated for hotfix).
4. Write patch notes: what broke, what was fixed, any player action required.

## Hotfix checklist

- [ ] Fix is minimal and targeted
- [ ] Reproduced on release build before and verified after fix
- [ ] Patch version and notes written
- [ ] Save/load or upgrade path tested if data format touched
- [ ] Rollback plan noted

Stop when the patch is live and documented; escalate balance-only changes to a normal milestone if scope grows.
