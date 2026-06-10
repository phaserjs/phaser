# Asset Conventions

Quick reference for project-local Cursor assets in a consumer repo.

## Directory layout

```
your-repo/
├── AGENTS.md                          # project agent instructions
├── .cursor/
│   ├── rules/
│   │   ├── core/                      # vendored from Cursor_base (do not edit)
│   │   └── project/                   # YOUR repo-specific rules
│   │       ├── stack-conventions.mdc
│   │       └── testing.mdc
│   ├── skills/
│   │   ├── cloud/                     # vendored
│   │   ├── efficiency/                # vendored
│   │   ├── workflow/                  # vendored
│   │   └── <your-category>/           # YOUR skills
│   │       └── <skill-name>/
│   │           ├── SKILL.md
│   │           └── references/        # optional
│   ├── agents/
│   │   ├── code-reviewer.md           # vendored
│   │   └── <your-agent>.md            # YOUR agents
│   ├── scripts/                     # vendored MCP install scripts
│   ├── environment.json
│   ├── mcp.json
│   └── hooks.json
└── .cursor-base-version
```

## Rule frontmatter

```yaml
---
description: TypeScript/React conventions for this monorepo
alwaysApply: false
globs: apps/web/**/*.{ts,tsx}
---
```

| Field | Required | Notes |
|-------|----------|-------|
| `description` | yes | Shown in rule picker; keep under one line |
| `alwaysApply` | yes | `true` for universal rules; `false` when using globs |
| `globs` | optional | File patterns; use when rule applies to a subset |

## Skill frontmatter

```yaml
---
name: add-api-endpoint
description: Add a new REST API endpoint following this repo's handler pattern. Use when creating routes, controllers, or API handlers.
paths: src/api,src/routes
---
```

| Field | Required | Notes |
|-------|----------|-------|
| `name` | yes | Must match parent folder name exactly |
| `description` | yes | Include when-to-use trigger phrases |
| `paths` | optional | Comma-separated paths for auto-invocation |

## Agent frontmatter

```yaml
---
name: security-reviewer
description: Reviews auth, payment, and PII-handling code for security issues. Use proactively before merging sensitive changes.
model: inherit
readonly: true
---
```

| Field | Required | Notes |
|-------|----------|-------|
| `name` | yes | Must match filename without `.md` |
| `description` | yes | Say when to delegate; use "use proactively" to encourage auto-delegation |
| `model` | optional | Usually `inherit` |
| `readonly` | optional | `true` for reviewers/verifiers |

Custom agents in `.cursor/agents/` register as Task `subagent_type` values matching the `name` field after bootstrap (or IDE restart locally). Include a non-empty prompt body after the frontmatter — empty bodies prevent registration. If a custom type is rejected, fall back to built-in `explore` with thoroughness `quick` for narrow questions.

## Content guidelines

1. **Be specific** — reference real directories, commands, and patterns from the repo.
2. **Be actionable** — tell agents what to do, not just what exists.
3. **Stay current** — update assets when conventions change.
4. **Avoid duplication** — global Cursor_base already covers communication, scope, exploration, and PR workflow.
5. **No secrets** — reference dashboard secret *names*, never values.

## Merge precedence

`update-cursor-base.sh` refreshes vendored assets but **preserves**:

- `.cursor/mcp.json`
- `AGENTS.md`
- `.cursor/environment.json`
- Everything under `.cursor/rules/project/` and custom skills/agents you add

Project rules in `.cursor/rules/project/` take precedence over vendored rules on conflict.
