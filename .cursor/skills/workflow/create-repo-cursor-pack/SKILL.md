---
name: create-repo-cursor-pack
description: Plan and create project-specific Cursor assets (rules, skills, agents, AGENTS.md) tailored to a repository's stack, architecture, and workflows. Use when bootstrapping cursor config for a new repo, adding local rules/skills/agents, or building a repo-specific agent knowledge pack.
---

# Create Repo Cursor Pack

Build a **project-local** Cursor asset pack that complements global Cursor_base assets already vendored into `.cursor/`.

Global assets (communication, explore-codebase, create-pr, verifier, etc.) are maintained upstream — **do not duplicate them**. This skill covers repo-specific knowledge agents need to work effectively in *this* codebase.

## Prerequisites

- [ ] Cursor_base bootstrapped: `.cursor/rules`, `.cursor/skills`, `.cursor/agents` exist
- [ ] `.cursor-base-version` present (confirms global assets are installed)

If missing, run Cursor_base bootstrap first (see `cloud-agent-setup` skill).

## Phase 1 — Discover the repository

Gather enough context to decide what agents need to know. Run searches in parallel.

| Area | What to find | How |
|------|--------------|-----|
| Stack | Languages, frameworks, package managers, runtime versions | `package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`, CI config |
| Layout | Key directories, entry points, module boundaries | Top-level README, `src/`, `app/`, `lib/` |
| Conventions | Naming, imports, error handling, test patterns | Read 2–3 representative files per layer |
| Workflows | Build, test, lint, deploy, migrations | `AGENTS.md`, CI workflows, Makefiles, scripts |
| Domain | Business concepts, APIs, data models | Docs, types/schemas, route definitions |
| Pain points | Flaky tests, manual steps, non-obvious setup | Existing docs, comments, gotchas in CI |

**Stop when** you can answer: *What stack is this? What are the main directories? How do you build, test, and run it? What conventions must agents follow?*

## Phase 2 — Plan the asset pack

Draft a short plan before writing files. Present it to the user if they did not specify scope.

### What to create

| Asset type | Location | When to add |
|------------|----------|-------------|
| **Rules** | `.cursor/rules/project/*.mdc` | Always-on or path-scoped conventions agents must follow |
| **Skills** | `.cursor/skills/<category>/<name>/SKILL.md` | Multi-step workflows repeated in this repo |
| **Agents** | `.cursor/agents/<name>.md` | Specialized review or validation subagents |
| **AGENTS.md** | repo root | Run, test, debug instructions (fill template if empty) |
| **environment.json** | `.cursor/environment.json` | Cloud agent install/start commands |

### Planning heuristics

**Rules** — prefer a few focused rules over one giant file:

- `stack-conventions.mdc` — language/framework idioms (globs: `**/*.{ts,tsx}`)
- `architecture.mdc` — layer boundaries, where code belongs
- `testing.mdc` — test file location, naming, how to run subsets
- `api-patterns.mdc` — route/handler conventions (globs: `**/api/**`)

Use `alwaysApply: true` only for rules that apply everywhere. Use `globs` for path-scoped rules.

**Skills** — one skill per repeatable workflow:

- Adding a feature in a specific pattern (e.g. `add-api-endpoint`, `add-migration`)
- Release or deployment steps
- Debugging common failure modes

**Agents** — only when a distinct review persona helps:

- Security reviewer for auth/payment code
- Schema/migration reviewer for database-heavy repos

**Do not create** assets for knowledge already covered by global Cursor_base rules/skills unless this repo has *specific overrides*.

### Plan template

```markdown
## Cursor asset plan for <repo>

### Rules
- [ ] `<name>.mdc` — <purpose> — alwaysApply: <true|false> — globs: <patterns>

### Skills
- [ ] `<category>/<name>` — <when to invoke>

### Agents
- [ ] `<name>` — <when to delegate>

### Project files
- [ ] AGENTS.md — <sections to fill>
- [ ] environment.json — <install command>
```

## Phase 3 — Create assets

Follow naming conventions strictly (see [references/asset-conventions.md](references/asset-conventions.md)).

### Rules (`.mdc`)

```yaml
---
description: <one-line purpose>
alwaysApply: false          # or true
globs: src/**/*.ts          # optional; omit if alwaysApply: true
---
```

Place under `.cursor/rules/project/`. Write concrete, actionable guidance — cite real paths and patterns from the repo.

### Skills (`SKILL.md`)

```yaml
---
name: <folder-name>         # must match parent folder name
description: <when to use>  # include trigger phrases
paths: <optional>           # comma-separated paths that auto-invoke
---
```

Place under `.cursor/skills/<category>/<name>/`. Keep SKILL.md focused; put long templates in `references/`.

### Agents (`.md`)

```yaml
---
name: <filename-without-md>
description: <when to delegate>
model: inherit
readonly: true              # for reviewers/verifiers
---
```

Filename must match `name` in frontmatter.

### AGENTS.md and environment.json

- Fill every section of `AGENTS.md` with **real commands** from the repo (not placeholders).
- `environment.json` `install` must be **idempotent** and tested.
- Reference dashboard secrets by name, never commit values.

Starter templates: [references/agents-md-starter.md](references/agents-md-starter.md)

## Phase 4 — Validate

Run this checklist before committing:

- [ ] Every `.mdc` file starts with `---` frontmatter and has `description`
- [ ] Every skill folder name matches `name:` in `SKILL.md`
- [ ] Every agent filename matches `name:` in frontmatter
- [ ] Rules use `globs` or `alwaysApply`, not both ambiguously
- [ ] No secrets or credentials in any asset file
- [ ] `AGENTS.md` commands work when run in a clean environment
- [ ] Assets are under `.cursor/` (project-local), not mixed into global Cursor_base paths

If Cursor_base is available locally, run `./scripts/validate.sh` in the Cursor_base repo to confirm your new skill/agents follow upstream conventions before vendoring changes globally.

## Suggested pack sizes

| Repo size | Rules | Skills | Agents |
|-----------|-------|--------|--------|
| Small (< 10k LOC) | 1–2 | 0–1 | 0 |
| Medium | 2–4 | 1–3 | 0–1 |
| Large / monorepo | 3–6 | 2–5 | 1–2 |

Start small. Add assets when agents repeatedly make the same mistake or ask the same questions.

## Commit guidance

Commit the pack on a feature branch with a clear message, e.g.:

```
Add project-specific Cursor assets for <repo>

- Rules: stack conventions, testing patterns
- Skills: add-api-endpoint
- Filled AGENTS.md with build/test commands
```

Project-local assets live in the target repo's git — they are **not** overwritten by `update-cursor-base.sh`.
