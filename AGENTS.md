# AGENTS.md

Instructions for Cursor agents (local and cloud) working in this repository.

## Project overview

Phaser is the open-source HTML5 2D game framework maintained by Phaser Studio. This repo is the **framework source** (not a game project): JavaScript/TypeScript definitions, WebGL/Canvas renderer, physics integrations, and build tooling.

Key entry points:

- `src/` — framework source (scenes, game objects, renderer, loaders, physics)
- `types/` — TypeScript definitions (`phaser.d.ts`)
- `dist/` — built bundles (`phaser.js`, `phaser.esm.js`, minified variants)
- `config/` — webpack configs for dev, watch, and distribution builds
- `tests/` — Vitest unit tests
- `scripts/` — build helpers (shader bundling, TypeScript doc generation)
- `skills/` — Phaser-specific AI agent skills (framework API knowledge); separate from `.cursor/skills/` (Cursor_base workflows)

## Development setup

- Requires **Node.js 24.8.0** (see `.nvmrc`)
- Install dependencies: `npm ci`

## Running the application

Phaser is a library — there is no long-running dev server in this repo.

- `npm run watch` — webpack watch build (development bundle)
- `npm run dist` — production distribution build
- `npm run build` — standard webpack build

## Testing

- Full suite: `npm test` (Vitest)
- Watch mode: `npm run test:watch`
- Lint: `npm run lint` / `npm run lintfix`
- TypeScript definitions: `npm run ts` (generate + validate tsgen)

## Linting and formatting

- ESLint: `npm run lint` (config in `.eslintrc.json`)
- Source line count: `npm run sloc`

## Architecture notes

- Scene-based game loop; renderer is node-based (Phaser 4 WebGL pipeline)
- Webpack bundles `src/phaser.js` into `dist/` for npm and CDN consumers
- Vitest tests live under `tests/`; config in `vitest.config.js`
- Changelog and migration guides under `changelog/v4/`
- Repo `skills/` documents Phaser subsystems for AI agents; `.cursor/` holds Cursor IDE profile (rules, skills, agents from Cursor_base)

## Context efficiency

- Use Grep with `head_limit` and Read with `offset`/`limit` on large files — full-file reads are blocked above ~300 lines.
- Prefer `files_with_matches` Grep when you only need paths.
- Use WebSearch for web research; built-in WebFetch is blocked by the global efficiency hook.
- Large or generated paths: `dist/`, `package-lock.json`, `types/phaser.d.ts`, `changelog/`, built webpack output — slice instead of dumping full contents.

## Cursor Cloud specific instructions

### Environment

No secrets required for build, lint, or unit tests.

### Services

No external services needed for local build and test. API docs: https://docs.phaser.io/

### Known gotchas

- `dist/phaser.js` is large (~8 MB) because it includes inline JSDoc; minified `phaser.min.js` is the production artifact.
- TypeScript generation (`npm run tsdev`) requires building `scripts/tsgen` first.
- Default branch is `master`, not `main`.

<!-- CURSOR_BASE:cloud-checklist -->
### Cloud Agents checklist

Before launching a cloud agent on this repo:

- [ ] `AGENTS.md` filled in (not just HTML comments)
- [ ] `.cursor/environment.json` `install` includes project dependencies after hook chmod
- [ ] Secrets added in Cursor dashboard (never commit values)
- [ ] GitHub connected in Cursor settings for PR workflows
- [ ] (Optional) HTTP MCP integrations enabled at [cursor.com/dashboard/integrations](https://cursor.com/dashboard/integrations)

Run readiness check from a Cursor_base checkout:

```bash
/path/to/Cursor_base/scripts/verify-cloud-readiness.sh --target .
```

See `cloud/secrets-guide.md` in Cursor_base and paste optional MCP guidance from `cloud/snippets/mcp-cloud-setup.md` when needed.
<!-- /CURSOR_BASE:cloud-checklist -->
