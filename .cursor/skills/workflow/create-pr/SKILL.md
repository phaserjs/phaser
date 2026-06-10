---
name: create-pr
description: Create or update a GitHub pull request after completing work. Use when finishing a task, after committing and pushing changes, or when the user asks for a PR.
---

# Create Pull Request

## Prerequisites

- Changes are committed on a feature branch (not the base branch).
- Branch is pushed to origin: `git push -u origin <branch-name>`.

## Steps

1. Check git status and confirm the branch name and base branch (usually `main`).
2. Look for a PR template in the repo:
   - `.github/PULL_REQUEST_TEMPLATE.md`
   - `.github/PULL_REQUEST_TEMPLATE/*.md`
3. Draft the PR body with:
   - Summary of what changed and why
   - How to test or verify
   - Any risks or follow-ups
4. Create the PR as **ready for review** (not a draft) unless the user asked for a draft.
5. If a PR already exists for this branch, update it instead of creating a duplicate.

## PR body guidelines

- Write in complete sentences with good grammar.
- Explain what changed and why in plain language.
- Keep it proportional to the size of the change.
- Do not include internal agent metadata or HTML comment markers in the body.

## GitHub integration (primary)

Use Cursor's built-in GitHub integration and the `ManagePullRequest` tool for pull requests on the **current** repository. Do not default to `gh pr create` for normal PR workflow.

Use the `github-cli` skill only as a **backup** — for example when the integration is unavailable or when working with **other** repositories.

## Common issues

- **Push failed**: Retry with exponential backoff (4s, 8s, 16s, 32s).
- **No remote branch**: Push first, then create the PR.
- **Dirty working tree**: Commit or stash before pushing.
