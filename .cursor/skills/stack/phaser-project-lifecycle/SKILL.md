---
name: phaser-project-lifecycle
description: Navigate Phaser stack work across tooling, scenes, testing, debug, and web builds. Use when starting Phaser tasks or handing off between child skills and the game-development parent lifecycle.
---

# Phaser Project Lifecycle

Entry point for Phaser child-layer work. Route to specialist skills below. For milestone scope, playtests, ship, and hotfix, use the `game-development` parent skills.

## Lifecycle stages

| Stage | Skill | When to use |
|-------|-------|-------------|
| Milestone scope | `scope-game-milestone` (parent) | New feature slice or milestone planning |
| Bootstrap | `bootstrap-game-project` (parent) | New Phaser repo scaffold |
| Run / build | `phaser-tooling` | Dev server, install, lint, typecheck |
| Scenes / gameplay | `phaser-scene-workflow` | New scenes, game objects, physics, input |
| Test | `phaser-testing-workflow` | Unit, scene, or E2E regression |
| Debug | `phaser-debug-triage` | Console errors, asset load, physics glitches |
| Playtest | `run-playtest-session` (parent) | Structured milestone validation |
| Production build | `phaser-build-release` | Bundled static output for hosting |
| Ship | `ship-game-release` (parent) | Freeze, verify, publish |
| Hotfix | `patch-game-hotfix` (parent) | Minimal post-launch fix |

## Where are you?

| Situation | Start here |
|-----------|------------|
| New scene or gameplay feature | `phaser-scene-workflow` |
| Dev server won't start or build fails | `phaser-tooling` → `phaser-debug-triage` |
| Sprites or audio fail to load | `phaser-debug-triage` → `phaser-assets` rule |
| Need automated test before merge | `phaser-testing-workflow` |
| Preparing a milestone build | `run-playtest-session` (parent) |
| Shipping to players | `ship-game-release` (parent) → `phaser-build-release` |

## Rules (consult throughout)

- `phaser-conventions` — scenes, game objects, physics, TypeScript patterns
- `phaser-assets` — preload, atlases, audio, path conventions
- `phaser-testing` — test layout and assertions
- Parent: `game-dev-conventions`, `game-architecture`, `game-production`, `game-release`

## Global profile complements

- `create-pr` — ship changes through version control
- `create-repo-cursor-pack` — repo-local Phaser conventions beyond this layer
