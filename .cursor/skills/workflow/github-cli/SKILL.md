---
name: github-cli
description: Backup GitHub CLI (gh) workflows using GITHUB_ACCESS_TOKEN. Use only when the built-in GitHub integration cannot reach the target (e.g. other repos) or when a specific gh capability is required. Do not use for normal PR creation on the current repo.
---

# GitHub CLI (backup)

Cursor's **built-in GitHub integration** is the default for the workspace repository. Use this skill only when that integration is insufficient.

## When not to use gh

- Creating or updating pull requests on the **current** repo → use `create-pr` and `ManagePullRequest`
- Routine git push / branch workflow on the checked-out repo
- Anything the built-in integration already exposes for this repository

## When to use gh (backup)

- Viewing or changing **other** repositories (`-R owner/repo`)
- Cross-repo issue or PR search
- CI / workflow runs on repos outside the workspace
- `gh api` for endpoints the integration does not cover
- Last resort when built-in PR tooling is unavailable and the user explicitly wants CLI

## Prerequisites

1. `GITHUB_ACCESS_TOKEN` in the environment (Cloud Agents → Secrets, or local export).
2. `gh` on PATH.
3. Run `./scripts/verify-github.sh` before relying on the backup path (add `--repo owner/name` to confirm access to a specific external repo).

`gh` reads `GH_TOKEN`, not `GITHUB_ACCESS_TOKEN`. Bridge on every command or once per shell session:

```bash
export GH_TOKEN="$GITHUB_ACCESS_TOKEN"
```

Or prefix a single command:

```bash
GH_TOKEN="$GITHUB_ACCESS_TOKEN" gh issue list -R owner/other-repo --limit 10
```

Never print or log the token.

## External repository examples

Always pass `-R owner/repo` when the target is not the current workspace repo.

```bash
export GH_TOKEN="$GITHUB_ACCESS_TOKEN"

# Issues
gh issue list -R owner/other-repo --limit 20
gh issue view 42 -R owner/other-repo

# Pull requests
gh pr list -R owner/other-repo --state open --limit 20
gh pr view 99 -R owner/other-repo

# CI
gh run list -R owner/other-repo --limit 10
gh pr checks 99 -R owner/other-repo

# Repo metadata
gh repo view owner/other-repo --json name,description,defaultBranchRef
```

For scripting, prefer `--json` with a field query (`-q`) and keep limits small (see `limit-tool-output` rule).

## Advanced API

```bash
export GH_TOKEN="$GITHUB_ACCESS_TOKEN"
gh api repos/owner/other-repo/issues --jq '.[0:5] | .[] | {number, title}'
```

## Common failures

| Symptom | Fix |
|---------|-----|
| `GITHUB_ACCESS_TOKEN is not set` | Add token in Cloud Agents → Secrets |
| HTTP 401 | Token expired or revoked — rotate in GitHub settings |
| HTTP 404 on `-R` repo | Token lacks access to that repo or org |
| `gh: command not found` | Install GitHub CLI or use a Cloud VM image that includes it |

## Reference

See `references/gh-commands.md` for a short command cheatsheet focused on cross-repo use.
