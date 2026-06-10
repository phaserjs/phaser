---
name: phaser-scene-workflow
description: Add or modify Phaser scenes and game objects. Use when creating scenes, wiring physics, input, or extending gameplay code.
---

# Phaser Scene Workflow

Part of the Phaser lifecycle — see `phaser-project-lifecycle` for routing. Apply `phaser-conventions` and `phaser-assets`.

## Before editing

1. Read the scene class or module — note `preload`, `create`, and `update` responsibilities.
2. Check `GameConfig` in the entry point for scene registration order and physics type.
3. Find similar scenes for naming, group usage, and event patterns.

## Implement

1. Keep `preload` for asset loading only; put setup in `create`.
2. Use game objects with clear roles — sprites, containers, and groups for related entities.
3. Prefer scene events (`this.events.emit`) or a small game-state module over global singletons.
4. Register input handlers in `create`; clean up listeners in `shutdown` when adding custom listeners.

## Validate

- [ ] Scene loads without console errors in dev server
- [ ] Assets referenced in `preload` match paths in `phaser-assets` conventions
- [ ] Physics bodies and colliders behave as expected in play mode
- [ ] Scene transitions (if any) do not leak timers or input handlers

For test coverage, use `phaser-testing-workflow`. For load or runtime errors, use `phaser-debug-triage`.
