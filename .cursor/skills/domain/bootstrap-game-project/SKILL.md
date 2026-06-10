---
name: bootstrap-game-project
description: Set up core cross-engine project structure. Use when starting a new game repo, scaffolding managers/autoloads, or establishing folder conventions.
---

# Bootstrap Game Project

Game-specific scaffold — for generic Cursor assets (rules, AGENTS.md), use the global `create-repo-cursor-pack` skill.

## Phase 1 — Layout

1. Read existing repo structure or establish conventions:
   - `scenes/` or `levels/` — playable content
   - `scripts/` or `src/` — gameplay logic
   - `assets/` — art, audio, fonts (or engine default paths)
   - `data/` or `resources/` — tunable configs, scriptable objects
2. Match engine defaults when present (Godot `res://`, Unity `Assets/`).
3. Document folder purpose in README or `AGENTS.md`.

## Phase 2 — Core systems

1. Scaffold persistent managers (input, audio, game state, scene transition) as autoloads/singletons or a documented service pattern.
2. Define scene flow: boot → main menu → gameplay (even as placeholders).
3. Add a minimal playable loop (move, interact, or menu navigation) before feature breadth.
4. Set up save/load stub or explicit "no save yet" decision.

## Phase 3 — Tooling

1. Document how to run the game (`run-game-project` skill).
2. Add debug keys or cheats behind a dev flag if useful for iteration.
3. Bootstrap Cursor layers if applicable: `--parent game-development --child <engine>`.

## Exit criteria

- [ ] Folder layout documented
- [ ] Core managers and scene flow exist (even as stubs)
- [ ] Game runs in editor or dev build from documented entry point
- [ ] README or AGENTS.md lists run command

Stop when the repo has a runnable skeleton; use `scope-game-milestone` before adding milestone scope.
