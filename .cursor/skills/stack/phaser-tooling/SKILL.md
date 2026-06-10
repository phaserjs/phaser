---
name: phaser-tooling
description: Run Phaser project tooling — install, dev server, build, lint, and typecheck. Use when fixing import errors, starting the game locally, or choosing the correct npm script.
---

# Phaser Tooling

## Detect the stack

1. Check `package.json` for `phaser` and the bundler (`vite`, `webpack`, `parcel`, `esbuild`).
2. Look for `tsconfig.json` — Phaser projects are often TypeScript.
3. Read `AGENTS.md`, `README.md`, and CI workflows for canonical commands.
4. Find the game entry point (`src/main.ts`, `src/game.ts`, `index.html`).

## Common commands

| Task | Typical command |
|------|-----------------|
| Install | `npm install` / `pnpm install` / `yarn` |
| Dev server | `npm run dev` or `npm start` |
| Build | `npm run build` |
| Preview prod build | `npm run preview` |
| Test | `npm test` or `npm run test` |
| Lint | `npm run lint` |
| Typecheck | `npm run typecheck` or `tsc --noEmit` |

Use the repo's actual script names — do not assume defaults exist.

## CI parity

1. Open `.github/workflows/` (or equivalent) and mirror install → lint → test → build locally.
2. Match the Node version CI uses (`.nvmrc`, `engines` field, setup-node matrix).
3. If local env differs from CI, note the gap in the PR and rely on CI for the authoritative check.

## Local dev tips

1. Open the browser devtools console — Phaser errors often appear there, not in the terminal.
2. Confirm asset paths resolve against the dev server base URL (`public/`, `assets/`).
3. For systematic diagnosis, use `phaser-debug-triage`.
