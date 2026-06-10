---
name: verify-cloud-run
description: Verify a repository is ready for Cursor Cloud Agents and debug failed setup. Use after configuring AGENTS.md or environment.json, or when cloud agent install or test commands fail.
paths: AGENTS.md,.cursor/environment.json
---

# Verify Cloud Run

Use this workflow when onboarding a repo for cloud agents or when a cloud run fails during install, build, or test.

## Step 1 — Readiness check

From a Cursor_base checkout (or vendored copy):

```bash
/path/to/Cursor_base/scripts/verify-cloud-readiness.sh --target /path/to/repo --warn
```

Fix any **ERROR** items before continuing. Address **WARN** items when they apply to the task (e.g. missing `start` when the app needs a dev server).

## Step 2 — Validate environment.json install

Confirm `.cursor/environment.json`:

- `install` is idempotent (safe to run multiple times)
- Includes project dependency steps after the baseline hook chmod
- `build` / `start` are set when AGENTS.md documents build or dev-server workflows

Reason about whether the install command matches the stack (Node, Python, Go, etc.). See stack snippets in `cloud/snippets/environment-*.json`.

## Step 3 — Smoke test from AGENTS.md

Run the minimal commands documented in AGENTS.md:

1. Dependency install (or rely on VM `install` if already run)
2. A focused test command (single file or fast subset preferred)
3. Lint if the failure might be formatting-related

Do not assume secrets exist — check AGENTS.md for required dashboard secret names.

## Step 4 — Report blockers

Summarize findings:

| Category | Examples |
|----------|----------|
| Config | Unfilled AGENTS.md, baseline-only environment.json |
| Secrets | Missing `DATABASE_URL`, `API_KEY`, etc. |
| Install | Wrong package manager, missing system dependency |
| Tests | Flaky integration tests, missing services |
| Network | Blocked external URLs not documented for whitelist |

## Step 5 — Template updates

If upstream Cursor_base templates added or updated managed sections:

```bash
/path/to/Cursor_base/scripts/merge-cloud-templates.sh --target /path/to/repo
/path/to/Cursor_base/scripts/merge-cloud-templates.sh --target /path/to/repo --sync-sections
```

## Related

- `cloud-agent-setup` skill — initial onboarding
- `docs/consumer-cloud-onboarding.md` — full consumer guide
- `verify-cursor-profile.sh` — layout and hooks only (not cloud readiness)
