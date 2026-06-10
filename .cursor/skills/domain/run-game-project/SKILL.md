---
name: run-game-project
description: Discover and run game builds, editor play mode, and engine tooling for this repository. Use when starting the game, running headless tests, exporting a build, or finding the correct engine command.
---

# Run Game Project

## Detect the engine

| Signal | Engine |
|--------|--------|
| `project.godot` | Godot |
| `*.uproject` | Unreal |
| `ProjectSettings/` + `Assets/` | Unity |
| `Cargo.toml` with `bevy` | Bevy (Rust) |
| `package.json` with `phaser`, `pixi.js`, etc. | Web game |
| Custom `Makefile` / `scripts/` | Follow repo docs |

Read `README.md` or `AGENTS.md` first — the repo may wrap engine commands.

## Common tasks

| Task | Where to look |
|------|----------------|
| Open editor | README, engine docs, `scripts/` |
| Play in editor | Editor play button, or CLI headless run |
| Run tests | CI workflows, `Makefile`, engine test runner |
| Export / build | Export presets, `build.sh`, CI release job |
| Install deps | Submodule init, asset packs, `npm install` for tooling |

Use exact commands from the repo — do not assume default export paths or scene entry points exist.

## Godot (when `project.godot` present)

```bash
# Headless import / check (Godot 4)
godot --headless --path . --quit-after 1

# Run main scene (if documented)
godot --path .
```

Prefer the repo's documented main scene and export preset names.

## Release builds

For milestone or public releases, use the `ship-game-release` skill for freeze, verify, and publish steps.

Engine-specific export presets and platform packaging belong in the **stack child skill** (e.g. Godot `godot-export-release`). This skill covers discovering run/build commands only.

## Before finishing gameplay work

- [ ] Feature runs in editor play mode or documented dev build
- [ ] No new errors in engine output console
- [ ] Save/load and menu flows still work if the feature touches game state
