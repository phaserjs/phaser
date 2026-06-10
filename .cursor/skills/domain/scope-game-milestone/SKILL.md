---
name: scope-game-milestone
description: Define or refine a milestone, vertical slice, or cut list. Use when scoping a prototype, alpha, or feature milestone.
---

# Scope Game Milestone

## Phase 1 — Outcome

1. Write the milestone outcome in one sentence (what can a player do when this ships?).
2. Identify the core loop this milestone must prove (input → action → feedback → reward).
3. List non-goals — features explicitly deferred to later milestones.

## Phase 2 — Vertical slice

1. Name the smallest playable path that demonstrates the outcome (one level, one encounter, one menu flow).
2. List required systems, scenes, and assets for that slice only.
3. Flag dependencies: save/load, multiplayer, progression, platform cert, localization.

## Phase 3 — Cut list and backlog

1. Move out-of-scope work to a cut list with brief rationale.
2. Break remaining work into ordered tasks (blockers first).
3. Set a feature-freeze date or task count ceiling for the milestone.

## Milestone exit criteria

- [ ] Outcome, vertical slice, and cut list are documented (issue, design doc, or README section)
- [ ] Risks (save/load, multiplayer, etc.) are flagged at milestone start
- [ ] Team agrees on definition of done (see `game-production` rule)

Stop when scope is clear enough to start implementation without ambiguity on what ships.
