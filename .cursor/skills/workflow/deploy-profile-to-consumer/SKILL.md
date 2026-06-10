---
name: deploy-profile-to-consumer
description: Deploy Cursor_base global and layer profiles into another repository from a cloud agent. Use when bootstrapping or refreshing a consumer repo, deploying profiles cross-repo, or when only one repo is checked out on the VM.
---

# Deploy Profile to Consumer

Deploy Cursor_base assets (global profile + optional parent/child layers) into a **consumer** repository when the agent may not have both repos on disk.

## Problem

`bootstrap-cursor.sh` needs two paths on the same VM:

1. **Cursor_base** checkout (source)
2. **Consumer** checkout (target)

Cloud agents usually have **one** workspace repo. Clone the other side into `/tmp` before bootstrap.

## Choose a host workspace

| Host | Best for | Other repo appears as |
|------|----------|------------------------|
| **Cursor_base** | Bulk rollout, registry-driven deploys | `git clone` consumer → `/tmp/consumer-<name>` |
| **Consumer** | Onboarding one app + filling `AGENTS.md` | `git clone` Cursor_base → `/tmp/Cursor_base` |

## Quick path (script)

From a **Cursor_base** workspace:

```bash
./scripts/deploy-profile-to-repo.sh --repo owner/consumer-repo --dry-run
./scripts/deploy-profile-to-repo.sh --repo owner/consumer-repo
```

The script:

1. Resolves layers from `profiles/layers/consumer-repos.json` when registered
2. Shallow-clones the consumer (uses `GITHUB_ACCESS_TOKEN` when set for private repos)
3. Runs `bootstrap-cursor.sh` with `--parent` / `--child`
4. Runs `verify-cursor-profile.sh` and `verify-cloud-readiness.sh --warn`
5. Prints `git` commit, push, and PR steps

Options: `--parent`, `--child`, `--profile-config`, `--target-dir`, `--keep-clone`, `--skip-verify`.

Manual equivalent:

```bash
./scripts/list-consumer-repos.sh --repo bookfair-public
git clone --depth 1 https://github.com/owner/repo.git /tmp/consumer-repo
/workspace/scripts/bootstrap-cursor.sh \
  --target /tmp/consumer-repo \
  --parent programming \
  --child ruby-rails
/workspace/scripts/verify-cursor-profile.sh --target /tmp/consumer-repo
```

## Layer selection

1. **Registry** — `./scripts/list-consumer-repos.sh --repo <short-name>`
2. **Pinned config** — consumer `.cursor-profile.json` + `--profile-config`
3. **Stack inspection** — read `package.json`, `Gemfile`, `pyproject.toml` before bootstrap

| Stack signal | Typical child |
|--------------|---------------|
| Next.js / React UI | `react-web-app` |
| TypeScript library or CLI only | `typescript` |
| Rails `Gemfile` | `ruby-rails` |
| Python `pyproject.toml` / `requirements.txt` | `python` |
| Godot `project.godot` | `godot` |
| Docs site under `writing` parent | `technical-docs` |

Registry entries are **recommendations**, not proof of GitHub access.

## GitHub access patterns

| Need | Tool |
|------|------|
| PR on **current** workspace repo | Built-in GitHub integration + `create-pr` / `ManagePullRequest` |
| Clone/push **private** consumer from Cursor_base host | `GITHUB_ACCESS_TOKEN` (see `github-cli` skill) |
| Read metadata on **other** repos | `gh repo view -R owner/repo` with token bridge |
| Full account repo list | Not available from cloud integration scope — use local `gh repo list` or dashboard |

Before relying on cross-repo `gh` or private clones:

```bash
./scripts/verify-github.sh --repo owner/consumer-repo
```

If the integration cannot reach a private consumer, start a cloud agent **in that consumer repo** and use Approach B (clone Cursor_base into `/tmp`).

## Phase 1 — Deploy vendored profile

| Step | Action |
|------|--------|
| 1 | Choose host (Cursor_base vs consumer) |
| 2 | Resolve `parent` / `child` (registry, profile config, or stack inspection) |
| 3 | Run `deploy-profile-to-repo.sh` or manual bootstrap |
| 4 | Verify profile + cloud readiness |
| 5 | Commit and open PR on **consumer** (bootstrap diff only) |

**PR scope:** `.cursor/**`, `.cursor-base-version`, `.cursor-profile.json` (when layers used), `AGENTS.md` / `.cursor/environment.json` only if newly created from templates.

## Phase 2 — Cloud readiness (same or follow-up PR)

Use `cloud-agent-setup` skill:

- Fill `AGENTS.md` (overview, setup, test, cloud section)
- Extend `.cursor/environment.json` `install` after hook chmod
- Add dashboard secrets
- Run `verify-cloud-readiness.sh --warn`
- Launch a test cloud agent on the consumer repo

## Phase 3 — Legacy Codex assets (when present)

If the consumer still has Codex rules/skills/agents:

1. Follow `convert-codex-to-cursor` to migrate into `.cursor/` project subtrees
2. Use `create-repo-cursor-pack` for net-new project-specific assets
3. Re-run `verify-cursor-profile.sh`

Do not overwrite bootstrapped global/layer assets with Codex copies — migrate into `*/project/` paths.

## Phase 3b — Post-deploy checklist

Run after the bootstrap PR merges (same or follow-up PR on the **consumer** repo):

| Step | When | Command / skill |
|------|------|-----------------|
| Codex migration | `.codex/` or `.agents/` present | `convert-codex-to-cursor` |
| Stale path audit | After Codex migration or skill copy | Grep `.cursor/skills/project/` for `.codex/`, `DATABASE_PATH`, `cmd /c`; fix paths to match current stack |
| Project pack | `.cursor/rules/project/` empty (only `.gitkeep`) | `create-repo-cursor-pack` |
| Remove legacy Codex | Tests pass; no `.codex/` refs in `.cursor/` | Archive or delete `.codex/`, `.agents/` |
| Consumer CI | No `.github/workflows/cursor-base-*.yml` | Copy `templates/new-repo/.github/workflows/cursor-base-check.yml` and optionally `cursor-base-refresh.yml` |
| Registry pin | Layers confirmed | Ensure `.cursor-profile.json` matches `consumer-repos.json` or stack inspection |

See `docs/consumer-cloud-onboarding.md` **After first deploy** for CI variable setup and template merge flags.

## Phase 4 — Refresh after Cursor_base updates

```bash
./scripts/update-cursor-base.sh --target /path/to/consumer --profile-config --merge-templates
```

Passes `--profile-config` to `bootstrap-cursor.sh` so pinned layers in `.cursor-profile.json` are preserved. `--merge-templates` syncs managed `AGENTS.md` sections without overwriting custom content.

For CI-driven refresh, see `templates/new-repo/.github/workflows/cursor-base-refresh.yml`.

## Risks

| Risk | Mitigation |
|------|------------|
| Wrong child layer | Inspect stack files; compare `react-web-app` vs `typescript` |
| Cannot push to private consumer | `GITHUB_ACCESS_TOKEN` or agent hosted in consumer repo |
| Custom global edits lost | Keep customizations under `*/project/` only |
| Registry ≠ access | Probe with `verify-github.sh --repo`; registry is guidance |

## Related assets

| Asset | Role |
|-------|------|
| `expand-layer-profile` | Expanding layer source packs in Cursor_base |
| `create-repo-cursor-pack` | Project-local rules/skills/agents in consumer |
| `convert-codex-to-cursor` | Migrate legacy Codex config |
| `github-cli` | Backup `gh` for external/private repos |
| `cloud-agent-setup` | AGENTS.md and environment.json |
| `list-consumer-repos.sh` | Registry lookup |
