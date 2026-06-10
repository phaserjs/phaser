---
name: cloud-agent-setup
description: Configure a repository for Cursor cloud agents. Use when setting up AGENTS.md, environment.json, cloud secrets, or onboarding a new repo for cloud agent runs.
paths: AGENTS.md,.cursor/environment.json
---

# Cloud Agent Setup

## Required files in consumer repos

| File | Purpose |
|------|---------|
| `AGENTS.md` | How to run, test, and debug the project (cloud agents are smart but low-context) |
| `.cursor/environment.json` | Install, build, and start commands for the cloud VM |
| Dashboard secrets | API keys and tokens — never commit to git |

## AGENTS.md sections

1. **Project overview** — What the repo does, main entry points.
2. **Development setup** — Install dependencies, required tools/versions.
3. **Running the app** — Start commands, default ports, URLs.
4. **Testing** — How to run tests (full suite and focused subsets).
5. **Cloud-specific instructions** — Login flows, env vars, services that need network access.
6. **Optional MCP** — Paste block from `cloud/snippets/mcp-cloud-setup.md` if the project uses external MCP servers.

## environment.json

- `install` must be **idempotent** (safe to run multiple times).
- Keep `install` fast — put rare one-time setup in `AGENTS.md` for on-demand steps.
- Use dashboard **Secrets** tab for sensitive values, not `.env` in snapshots.

Cursor_base bootstraps a baseline `install` that only ensures hook scripts are executable:

```bash
chmod +x .cursor/hooks/scripts/*.sh 2>/dev/null || true
```

Append project-specific steps after that block (e.g. `npm install`, `pip install -r requirements.txt`).

## GitHub access scope

Cloud agents interact with GitHub through **different surfaces** with different reach:

| Surface | Scope | Use for |
|---------|-------|---------|
| Built-in GitHub integration | Current workspace repo + limited API | PRs on checked-out repo, standard agent workflow |
| `ManagePullRequest` / `create-pr` | Current repo | Default PR create/update |
| `GITHUB_ACCESS_TOKEN` + `gh` (backup) | Token-scoped repos | Private clones, cross-repo queries, CI on other repos |
| `profiles/layers/consumer-repos.json` | Recommendations only | Layer hints — **not** proof of access |

**Patterns:**

1. **Deploy profile to another repo from Cursor_base** — clone consumer to `/tmp`, bootstrap, push PR on consumer. Private repos need `GITHUB_ACCESS_TOKEN` or an agent hosted in the consumer repo. See `deploy-profile-to-consumer` skill and `scripts/deploy-profile-to-repo.sh`.

2. **Work inside the consumer repo** — clone Cursor_base to `/tmp`, bootstrap into `.`, customize `AGENTS.md`. Best when filling cloud templates and project-specific assets.

3. **List all account repos** — not available from cloud integration (`403` on `gh api user/repos`). Use local `gh repo list` or Cursor dashboard → GitHub connections.

Before cross-repo `gh` or private clones:

```bash
./scripts/verify-github.sh --repo owner/other-repo
```

## MCP for cloud agents (optional)

The global profile ships **no default MCP servers**. Built-in tools plus rules and hooks cover routine development.

When the project needs external tools:

- **HTTP MCPs (recommended):** Configure at [cursor.com/dashboard/integrations](https://cursor.com/dashboard/integrations); enable at [cursor.com/agents](https://cursor.com/agents).
- **stdio MCPs:** Add to `.cursor/mcp.json`; ensure `environment.json` `install` provides runtimes (`npx` needs Node.js).
- **GitHub / Linear:** Built-in Cursor integrations for the workspace repo — no MCP required for routine PR/issue workflows. Optional `GITHUB_ACCESS_TOKEN` for backup `gh` on other repos (see `github-cli` skill).
- **Secrets:** Dashboard Secrets tab; `${env:VAR}` is unreliable for dashboard MCP config — use literal values in integration UI.

See `mcp/recommended-servers.md` and `cloud/snippets/mcp-cloud-setup.md`.

## Subagents for cloud agents

Bootstrap copies vendored agents (including `lightweight-explorer`) to `.cursor/agents/`. Cursor registers each agent `name` as a Task `subagent_type` when supported.

**Cloud fallback:** If Task rejects `subagent_type: lightweight-explorer`, use built-in `explore` with thoroughness `quick` for the same narrow questions.

## Stack snippets

Copy a starting point from `cloud/snippets/` in Cursor_base:

| File | Use when |
|------|----------|
| `environment-node.json` | npm / Node.js projects |
| `environment-python.json` | pip / Python projects |
| `environment-monorepo.json` | pnpm workspaces |

See `cloud/environment.json.example` and `cloud/AGENTS.md.example` for filled examples.

## Verify readiness

```bash
/path/to/Cursor_base/scripts/verify-cloud-readiness.sh --target . --warn
/path/to/Cursor_base/scripts/verify-cursor-profile.sh --target .
```

Use the `verify-cloud-run` skill when debugging failed cloud agent installs or tests.

## Template updates

When Cursor_base templates gain new sections or refresh managed blocks:

```bash
/path/to/Cursor_base/scripts/merge-cloud-templates.sh --target .
/path/to/Cursor_base/scripts/merge-cloud-templates.sh --target . --sync-sections
/path/to/Cursor_base/scripts/update-cursor-base.sh --target . --merge-templates
```

Managed sections use `<!-- CURSOR_BASE:name -->` markers in `cloud/AGENTS.md.template`. Content outside those markers is never overwritten.

## Checklist for a new repo

- [ ] `AGENTS.md` filled in from template (see `cloud/AGENTS.md.example`)
- [ ] `.cursor/environment.json` with working install command (project deps after hook chmod)
- [ ] Secrets added to cloud agent dashboard
- [ ] Bootstrap script run to vendor global Cursor assets
- [ ] `verify-cloud-readiness.sh --warn` passes
- [ ] `verify-cursor-profile.sh` passes
- [ ] (Optional) MCP configured in dashboard or `.cursor/mcp.json`
- [ ] Verify a cloud agent can install deps and run tests

See [docs/consumer-cloud-onboarding.md](../../docs/consumer-cloud-onboarding.md) for the full consumer guide.
