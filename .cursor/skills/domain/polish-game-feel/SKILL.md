---
name: polish-game-feel
description: Juice and feedback pass on a feature or milestone. Use when mechanics work but lack audio/VFX/UI feedback or tuning.
---

# Polish Game Feel

## Phase 1 — Audit

1. Play the feature or milestone path; list missing feedback moments (hit, pickup, failure, success, UI confirm).
2. Note silent actions — player cannot tell if input registered.
3. Separate polish gaps from logic bugs (hand off bugs to `debug-gameplay`).

## Phase 2 — Feedback pass

1. Add minimal juice per moment: sound, particle, screen shake, UI animation, or controller rumble where supported.
2. Tune timing (anticipation, impact, recovery) before adding complex VFX.
3. Keep tuning values in resources or config files, not hardcoded literals.
4. Use placeholder assets if final art/audio is not ready — silence is worse than temp assets.

## Phase 3 — Validate

1. Re-play the path; confirm each player action has readable feedback.
2. Check audio levels and visual clutter — polish should clarify, not obscure.
3. Run a quick playtest note for feel-only changes.

## Exit criteria

- [ ] Core player actions have visible or audible feedback
- [ ] Tuning values live in data/resources where practical
- [ ] No new gameplay logic bugs introduced

Stop when the milestone feels readable to a fresh player; defer cosmetic art passes if out of scope.
