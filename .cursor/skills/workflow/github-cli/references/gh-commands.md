# gh command cheatsheet (backup / cross-repo)

Set the token bridge once per shell:

```bash
export GH_TOKEN="$GITHUB_ACCESS_TOKEN"
```

Replace `owner/repo` with the target repository. Cap `--limit` for agent efficiency.

## Issues

```bash
gh issue list -R owner/repo --limit 20
gh issue view 123 -R owner/repo
gh issue create -R owner/repo --title "Title" --body "Body"
gh issue comment 123 -R owner/repo --body "Comment"
```

## Pull requests

```bash
gh pr list -R owner/repo --state open --limit 20
gh pr view 45 -R owner/repo
gh pr checks 45 -R owner/repo
```

Do **not** use `gh pr create` on the current workspace repo when `ManagePullRequest` is available.

## Actions / CI

```bash
gh run list -R owner/repo --limit 10
gh run view 12345678 -R owner/repo
gh run watch 12345678 -R owner/repo
```

## Repository

```bash
gh repo view owner/repo
gh repo clone owner/repo /tmp/other-repo
```

## Search (org-wide)

```bash
gh search issues "label:bug" --owner my-org --limit 20
gh search prs "is:open author:username" --limit 20
```

## JSON output

```bash
gh issue list -R owner/repo --limit 5 --json number,title,state
gh api repos/owner/repo/pulls/1 --jq '.title'
```
