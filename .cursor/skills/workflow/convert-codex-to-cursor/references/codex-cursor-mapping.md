# Codex → Cursor Asset Mapping

Quick reference for converting OpenAI Codex configuration into Cursor IDE assets.

## Discovery signals

| Signal | Likely Codex asset |
|--------|-------------------|
| `.agents/skills/**/SKILL.md` | Repo-scoped skills |
| `.codex/agents/*.toml` | Project subagents |
| `.codex/config.toml` | Project config (MCP, agents, overrides) |
| `codex/workflows.json` | Workflow inventory (custom convention) |
| `AGENTS.md` / `AGENTS.override.md` | Project instructions (shared format) |
| `~/.agents/skills/` | User-global skills (copy selectively into repo) |
| `~/.codex/AGENTS.md` | User-global instructions (do not commit) |

Run discovery in parallel:

```bash
# Repo-scoped Codex assets
find . -path './.git' -prune -o \( \
  -path '*/.agents/skills/*/SKILL.md' -o \
  -path '*/.codex/agents/*.toml' -o \
  -path '*/.codex/config.toml' -o \
  -name 'AGENTS.md' -o \
  -name 'AGENTS.override.md' -o \
  -path '*/codex/workflows.json' \
\) -print 2>/dev/null | sort
```

## Asset mapping

| Codex source | Cursor destination | Conversion notes |
|--------------|-------------------|------------------|
| `.agents/skills/<cat>/<name>/` | `.cursor/skills/<cat>/<name>/` | Copy tree; ensure `name:` matches folder; add `paths:` if skill targeted specific dirs |
| `.agents/skills/<name>/agents/openai.yaml` | (optional) skill frontmatter | Map `policy.allow_implicit_invocation: false` → narrow `description`; drop UI-only fields |
| `AGENTS.md` | `AGENTS.md` | Usually copy as-is; fill Cursor Cloud sections from `cloud/AGENTS.md.template` if missing |
| `AGENTS.override.md` | `.cursor/rules/project/<scope>.mdc` or merge into `AGENTS.md` | Overrides → path-scoped rules when they target a subtree; otherwise append to AGENTS.md |
| Nested `AGENTS.md` / `AGENTS.override.md` | Same path or `.cursor/rules/project/` with `globs` | Preserve directory scope using globs on the nested path |
| `.codex/agents/<name>.toml` | `.cursor/agents/<name>.md` | Convert TOML fields → YAML frontmatter + markdown body from `developer_instructions` |
| `.codex/config.toml` `[mcp_servers]` | `.cursor/mcp.json` | TOML table → JSON `mcpServers`; prefer HTTP MCPs for cloud agents |
| `.codex/config.toml` `[agents]` limits | Document in `AGENTS.md` or drop | Cursor Task tool has its own subagent model; no direct config port |
| `codex/workflows.json` entries | `.cursor/skills/<category>/<name>/` | Each workflow → skill with steps from `description` / `steps` fields |
| `.codex/config.toml` sandbox / approval | `.cursor/hooks.json` (advanced) | Only port if repo already uses Cursor hooks; otherwise document manual review steps |
| `CLAUDE.md` / `TEAM_GUIDE.md` (fallback docs) | `AGENTS.md` or `.cursor/rules/project/` | Merge content; do not keep duplicate instruction files |

## Subagent TOML → Cursor agent

Codex `.codex/agents/reviewer.toml`:

```toml
name = "reviewer"
description = "Reviews diffs for correctness before merge."
developer_instructions = """
Focus on logic errors and missing tests.
Do not rewrite style unless it hides bugs.
"""
model = "gpt-5.4"
readonly = true
```

Cursor `.cursor/agents/reviewer.md`:

```yaml
---
name: reviewer
description: Reviews diffs for correctness before merge. Use proactively before merging code changes.
model: inherit
readonly: true
---

Focus on logic errors and missing tests.
Do not rewrite style unless it hides bugs.
```

| Codex field | Cursor field |
|-------------|--------------|
| `name` | `name` (must match filename) |
| `description` | `description` (add delegation trigger phrases) |
| `developer_instructions` | Markdown body after frontmatter |
| `model` | `model: inherit` unless repo standardizes models |
| `readonly` / sandbox read-only | `readonly: true` |
| `mcp_servers`, `skills.config` | Document in agent body or project AGENTS.md |

## MCP TOML → mcp.json

Codex (`.codex/config.toml`):

```toml
[mcp_servers.github]
command = "npx"
args = ["-y", "@modelcontextprotocol/server-github"]
env = { GITHUB_TOKEN = "${GITHUB_TOKEN}" }
```

Cursor (`.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${env:GITHUB_TOKEN}"
      }
    }
  }
}
```

Notes:

- GitHub and Linear: prefer Cursor built-in integrations over MCP when the workflow is issue/PR UI only.
- Cloud agents: HTTP/dashboard MCPs are more reliable than stdio; document secrets in dashboard, not committed files.
- Bootstrap preserves existing `.cursor/mcp.json` — merge new servers, do not overwrite unrelated entries.

## Skill frontmatter differences

Both use `name` + `description`. Cursor additionally supports:

```yaml
paths: src/api,tests/integration
```

Codex skills may include `agents/openai.yaml` for UI and implicit-invocation policy. When converting:

- Keep the skill body and `references/` / `scripts/` subfolders unchanged when possible.
- Rename category folders to match Cursor conventions (`workflow`, `cloud`, stack-specific names).
- Ensure folder name equals `name:` in frontmatter (`validate.sh` enforces this).

## What not to migrate

| Codex-only | Reason |
|------------|--------|
| `~/.codex/config.toml` user defaults | Machine-local; not repo assets |
| `~/.codex/AGENTS.md` | Personal; belongs in user settings, not git |
| Codex sandbox approval modes | Cursor uses different execution/hook model |
| `$skill-name` CLI invocation syntax | Document equivalent: agent reads skill when description matches |
| Built-in Codex system skills | Use Cursor_base global profile instead |

## Post-migration layout

```
your-repo/
├── AGENTS.md                          # merged project instructions
├── .cursor/
│   ├── rules/
│   │   ├── core/                      # vendored from Cursor_base
│   │   └── project/                   # converted overrides + conventions
│   ├── skills/
│   │   ├── cloud/                     # vendored global skills
│   │   └── <category>/                # converted Codex skills
│   │       └── <skill-name>/
│   │           └── SKILL.md
│   ├── agents/                        # converted .codex/agents/*.toml
│   ├── mcp.json                       # merged MCP servers
│   ├── environment.json               # cloud install (see cloud-agent-setup)
│   └── hooks.json                     # vendored; extend only if needed
└── .cursor-base-version
```

Optional: keep `.codex/` and `.agents/` temporarily with a deprecation note in AGENTS.md until the team confirms Cursor-only workflows.

## Post-migration verification

After copying skills and agents, audit converted paths before deleting legacy Codex directories:

```bash
# Stale Codex references in migrated skills
rg -n '\.codex/|DATABASE_PATH|cmd /c' .cursor/skills/ || true

# Leftover legacy trees (remove after audit is clean)
test -d .codex && echo "WARN: .codex/ still present"
test -d .agents && echo "WARN: .agents/ still present"
```

| Pattern | Typical fix |
|---------|-------------|
| `.codex/skills/...` | `.cursor/skills/project/...` |
| `DATABASE_PATH` | Current store env var (e.g. `MULTITOOL_STORE_PATH`) |
| `cmd /c` | Linux/macOS commands documented in AGENTS.md |
| `npm run db:seed` | Current data script (e.g. `npm run data:seed`) |

Re-run project tests after path fixes. Delete `.codex/` and `.agents/` only when grep is clean and tests pass.
