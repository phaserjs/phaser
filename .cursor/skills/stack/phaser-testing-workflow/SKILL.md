---
name: phaser-testing-workflow
description: Add or run Phaser tests for scenes and game logic. Use when adding regression coverage or fixing flaky gameplay tests.
---

# Phaser Testing Workflow

Apply `phaser-testing` rule. For run commands, start with `phaser-tooling`.

## Phase 1 — Detect test stack

| Marker | Approach |
|--------|----------|
| `vitest` in `package.json` | Vitest unit tests with mocked Phaser |
| `jest` in `package.json` | Jest with canvas/Phaser mocks |
| `playwright` or `cypress` | Browser E2E against dev or preview server |
| `*.test.ts` beside scene modules | Unit tests for pure game logic |

Read `AGENTS.md` and CI for canonical test commands.

## Phase 2 — Write tests

1. Test public behavior of scenes and game logic — not Phaser internals.
2. Extract pure functions (scoring, state transitions, collision rules) for unit tests.
3. Mock `Phaser.Scene` or use headless stubs when testing scene classes.
4. For E2E, assert player-visible behavior (menu → start → score) not canvas pixels.

## Phase 3 — Run

1. Run the project test command locally before pushing.
2. Fix order-dependent tests — reset game registry or scene state between tests.
3. Match CI Node and browser versions when tests are environment-sensitive.

## Phase 4 — Ship

- [ ] New bug fixes include a regression test when the repo supports testing
- [ ] `phaser-quality-reviewer` invoked for substantial gameplay changes
- [ ] Playtest notes updated for milestone-visible behavior (`run-playtest-session` parent)
