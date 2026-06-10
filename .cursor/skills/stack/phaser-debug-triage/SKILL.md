---
name: phaser-debug-triage
description: Triage Phaser runtime errors, asset load failures, physics issues, and build problems. Use when the game won't load, sprites are missing, or production builds behave differently from dev.
---

# Phaser Debug Triage

For cross-cutting gameplay bugs, start with parent `debug-gameplay`. This skill covers Phaser-engine-specific diagnosis.

## Phase 1 — Capture

1. Read the browser console stack trace — note scene name and line.
2. Record whether the error is dev-only, production-build-only, or both.
3. Check the Network tab for 404 asset requests.

## Phase 2 — Classify

| Symptom | Likely cause | Check |
|---------|--------------|-------|
| `Cannot read properties of undefined` in `create` | Asset key missing from `preload` | Key spelling, atlas JSON, load order |
| Black screen, no errors | Scene not started or wrong key | `scene.start` key matches class `key` |
| Sprite shows placeholder / missing texture | Wrong path or key | `public/` vs bundled path, case sensitivity |
| Works in dev, broken in prod build | Base URL or asset path | `base` in Vite config, relative paths |
| Physics not colliding | Wrong body size or layer | Arcade vs Matter, `setCollideWorldBounds` |
| Input not responding | Scene not active or pointer blocked | `setInteractive`, scene stack, overlay depth |
| Audio silent | Autoplay policy or wrong key | User gesture, `this.sound.add` key |

## Phase 3 — Fix

1. Use consistent asset keys defined in one place (constants module or atlas manifest).
2. Prefer `this.load` in `preload` with paths relative to the bundler's public root.
3. Re-run production preview (`phaser-tooling`) after path or base-URL changes.

## Phase 4 — Confirm

- [ ] Repro path clean in dev server
- [ ] Production preview build loads main scene and assets
- [ ] Regression test via `phaser-testing-workflow` when fixing gameplay bugs
