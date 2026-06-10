---
name: convert-codex-to-cursor
description: Convert existing OpenAI Codex agent assets (.agents/skills, .codex/agents, AGENTS.md, MCP config) into Cursor IDE assets under .cursor/. Use when migrating from Codex to Cursor, onboarding a Codex-configured repo, or consolidating dual agent setups.
paths: .agents,.codex,AGENTS.md,codex
---

# Convert Codex Assets to Cursor

Migrate **existing Codex configuration** in a repository into **Cursor-compatible assets** under `.cursor/`, while preserving project knowledge and avoiding duplication of Cursor_base global profile assets.

Codex and Cursor share the [Agent Skills](https://developers.openai.com/codex/skills) `SKILL.md` format and root-level `AGENTS.md`. Most migration work is **relocating**, **renaming**, and **translating** Codex-specific config (TOML agents, `.codex/config.toml`) into Cursor equivalents.

## Prerequisites

- [ ] Confirm the repo has Codex assets to migrate (see Phase 1).
- [ ] Bootstrap Cursor_base global profile if `.cursor/rules/core/` is missing (`cloud-agent-setup` skill or `bootstrap-cursor.sh`).
- [ ] Do **not** overwrite vendored global skills/agents/rules — convert Codex assets into **project-local** paths (`.cursor/skills/<your-category>/`, `.cursor/agents/`, `.cursor/rules/project/`).

Full field mapping: [references/codex-cursor-mapping.md](references/codex-cursor-mapping.md).

## Phase 1 — Discover Codex assets

Scan the repository and summarize what exists before writing files.

| Codex location | What to read |
|----------------|--------------|
| `.agents/skills/**/SKILL.md` | Repo skills (OpenAI standard path) |
| `.codex/agents/*.toml` | Project subagent definitions |
| `.codex/config.toml` | MCP servers, agent limits, doc fallbacks |
| `AGENTS.md`, `AGENTS.override.md` | Project instructions (any directory) |
| `codex/workflows.json` | Custom workflow inventory (if present) |
| `CLAUDE.md`, `TEAM_GUIDE.md`, `.agents.md` | Fallback instruction files referenced in Codex config |

Also check whether the user mentioned **user-global** Codex skills under `~/.agents/skills/` — only migrate those into the repo when the user explicitly wants them checked in.

**Stop when** you can produce an inventory table:

```markdown
| Source path | Type | Cursor target | Action |
|-------------|------|---------------|--------|
| .agents/skills/deploy/SKILL.md | skill | .cursor/skills/workflow/deploy/ | copy + verify frontmatter |
| .codex/agents/reviewer.toml | subagent | .cursor/agents/reviewer.md | convert TOML → md |
| AGENTS.md | instructions | AGENTS.md | merge Cloud sections |
```

Present the plan to the user when scope is large or destructive (replacing `.codex/` entirely).

## Phase 2 — Plan the migration

Apply these defaults unless the user specifies otherwise:

1. **Bootstrap first** — run Cursor_base bootstrap so `.cursor/rules/core/`, global skills, agents, and hooks exist before adding converted assets.
2. **Skills** — copy each Codex skill folder to `.cursor/skills/<category>/<name>/`; preserve `references/` and `scripts/` subfolders.
3. **Agents** — convert each `.codex/agents/*.toml` to `.cursor/agents/<name>.md` (YAML frontmatter + markdown body).
4. **Instructions** — keep root `AGENTS.md`; merge `AGENTS.override.md` and nested overrides into rules or AGENTS sections.
5. **MCP** — merge `.codex/config.toml` MCP entries into `.cursor/mcp.json` (preserve existing servers).
6. **Workflows** — map `codex/workflows.json` entries to new or existing skills.
7. **Remove legacy Codex dirs** — after tests pass and path audit is clean, delete `.codex/` and `.agents/` (or archive behind a deprecation note in AGENTS.md when the team wants a rollback window).

**Do not duplicate** global Cursor_base assets (create-pr, explore-codebase, verifier, core rules). Skip Codex skills that overlap — note them in the migration summary instead.

## Phase 3 — Convert assets

### Skills (`.agents/skills/` → `.cursor/skills/`)

For each skill directory:

1. Choose a Cursor category folder (`workflow`, `cloud`, or a repo-specific name like `deploy`).
2. Copy the entire skill folder to `.cursor/skills/<category>/<name>/`.
3. Verify frontmatter:

```yaml
---
name: <folder-name>       # must match parent directory exactly
description: <when to use> # keep Codex description; add Cursor trigger phrases
paths: <optional>          # add if skill applied to specific subtrees
---
```

4. Drop Codex-only `agents/openai.yaml` unless UI metadata is needed; map `allow_implicit_invocation: false` to a narrower description.
5. Copy sibling files (`references/`, `scripts/`, `assets/`) unchanged when present.

### Subagents (`.codex/agents/*.toml` → `.cursor/agents/*.md`)

Convert each TOML file:

| Codex (TOML) | Cursor (YAML frontmatter) |
|--------------|---------------------------|
| `name` | `name` (must match filename without `.md`) |
| `description` | `description` + "Use proactively when…" |
| `developer_instructions` | Markdown body below frontmatter |
| `model` | `model: inherit` (default) |
| read-only / review intent | `readonly: true` |

Ensure the agent file has a **non-empty body** after frontmatter (required for Task subagent registration).

### Instructions (`AGENTS.md` family)

| Source | Target |
|--------|--------|
| Root `AGENTS.md` | Keep at repo root; add Cursor Cloud sections from `cloud/AGENTS.md.template` if missing |
| `AGENTS.override.md` at root | Merge into `AGENTS.md` or split into `.cursor/rules/project/*.mdc` |
| Nested `AGENTS.md` / overrides | `.cursor/rules/project/<area>.mdc` with `globs` for that subtree |
| `CLAUDE.md` / fallback doc names | Merge into `AGENTS.md`; remove duplicates after migration |

Cursor Cloud agents need concrete **run/test/debug commands** in AGENTS.md — replace Codex-only placeholders.

### MCP (`.codex/config.toml` → `.cursor/mcp.json`)

1. Parse `[mcp_servers.*]` tables from Codex config.
2. Merge into existing `.cursor/mcp.json` under `mcpServers`.
3. Prefer Cursor dashboard HTTP integrations over stdio MCP for GitHub/Linear when applicable.
4. Reference dashboard **secret names** in docs — never commit token values.

### Workflows (`codex/workflows.json`)

For each workflow entry, create or extend a skill:

- Name from workflow `id` or `name` (kebab-case folder).
- `description` from workflow summary + trigger phrases.
- Steps from workflow `steps` or `description` body in SKILL.md.

### Cloud agent setup

After asset conversion, ensure:

- `.cursor/environment.json` has an idempotent `install` command (see `cloud-agent-setup` skill).
- `AGENTS.md` includes a **Cursor Cloud specific instructions** section.
- Run `verify-cloud-readiness.sh --target . --warn` when Cursor_base scripts are available.

## Phase 4 — Validate

Run this checklist:

- [ ] Every `.cursor/skills/**/SKILL.md` has `name` matching its parent folder.
- [ ] Every `.cursor/agents/*.md` has `name` matching its filename and a non-empty body.
- [ ] Every `.cursor/rules/project/*.mdc` has `description` and (`alwaysApply` or `globs`).
- [ ] No secrets or credentials in converted files.
- [ ] Global Cursor_base assets still present under `.cursor/rules/core/` and vendored skill trees.
- [ ] `.cursor/mcp.json` is valid JSON and merges cleanly with bootstrap template.
- [ ] `AGENTS.md` commands are real (not template placeholders).
- [ ] No stale Codex paths in converted skills — grep `.cursor/skills/` for `.codex/`, `DATABASE_PATH`, and `cmd /c`; update to current stack paths and env vars.
- [ ] Project skills under `.cursor/skills/project/` reference `.cursor/` paths only.

Stale-path audit (run from consumer repo root):

```bash
rg -n '\.codex/|DATABASE_PATH|cmd /c' .cursor/skills/ || true
```

Fix every match before removing legacy Codex directories.

When Cursor_base is available:

```bash
./scripts/validate.sh                              # in Cursor_base repo
./scripts/verify-cursor-profile.sh --target .      # in migrated consumer repo
./scripts/verify-cloud-readiness.sh --target . --warn
```

## Phase 5 — Summarize and commit

Provide a migration report:

```markdown
## Codex → Cursor migration summary

### Converted
- N skills → .cursor/skills/...
- N agents → .cursor/agents/...
- AGENTS.md updated (sections added: ...)
- MCP servers merged: ...

### Skipped (overlap with global profile)
- ...

### Legacy removed
- .codex/ deleted (or archived): yes / no
- .agents/ deleted (or archived): yes / no

### Manual follow-up
- Add dashboard secrets: ...
- Run bootstrap: ./scripts/bootstrap-cursor.sh --target .
```

Commit on a feature branch with a clear message, e.g.:

```
Migrate Codex agent assets to Cursor

- Convert .agents/skills to .cursor/skills
- Convert .codex/agents TOML to .cursor/agents markdown
- Merge MCP config into .cursor/mcp.json
- Update AGENTS.md for Cursor Cloud
```

Use the `create-pr` skill to open a PR after pushing (ready for review by default).

## Related skills

| Skill | When |
|-------|------|
| `cloud-agent-setup` | First-time Cursor cloud configuration after migration |
| `create-repo-cursor-pack` | Add new repo-specific assets beyond converted Codex files |
| `create-pr` | Open PR after migration commit |
