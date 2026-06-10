---
name: phaser-build-release
description: Build Phaser production bundles for static web hosting. Use when shipping a milestone build, creating deploy artifacts, or running production builds from CI.
---

# Phaser Build Release

Parent skill `ship-game-release` covers freeze, verify, and publish. This skill covers Phaser-specific production build steps.

## Before building

1. Check `package.json` build script and bundler config (`vite.config.ts`, `webpack.config.js`).
2. Confirm `base` path matches hosting (root `/` vs subdirectory `/game/`).
3. Disable debug-only overlays, cheats, and verbose logging in release configuration.
4. Run dev-server smoke test on the main scene.

## Build

1. Use documented build command from the repo — do not assume script names.

```bash
npm run build
```

2. Serve the output locally for smoke test:

```bash
npm run preview
```

3. For CI, match the workflow's Node version and build flags.

## Verify build

- [ ] `dist/` (or documented output) loads in browser without console errors
- [ ] All sprites, atlases, audio, and fonts load (check Network tab)
- [ ] Version string or build label matches changelog
- [ ] Main menu → gameplay → save/load (if applicable) works in preview

Stop when the build artifact passes smoke test; return to `ship-game-release` for publish steps.
