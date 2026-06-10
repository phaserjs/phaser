---
name: plan-cursor-base-upgrades
description: Examine Cursor_base capabilities and plan profile upgrades from asset inventory, dogfood validation, and recent agent chat sessions. Use when improving the global profile, running a self-upgrade review, or planning asset changes from agent effectiveness data.
paths: manifest.json,scripts/list-assets.sh,scripts/dogfood-test.sh
---

# Plan Cursor_base Upgrades

Self-upgrade workflow for the **Cursor_base** repository (or a fork maintaining the global profile). Produces a prioritized upgrade plan from three inputs:

1. **Current capabilities** — what assets exist and whether they pass validation
2. **Effectiveness** — how well assets work in practice (dogfood, hooks, docs)
3. **Recent agent chats** — the last 10 cloud agent sessions across all repos (Cursor_base and bootstrapped consumers)

Do **not** implement upgrades in the same pass unless the user asks. Default output is a structured plan the user can triage.

## Prerequisites

- [ ] Working in the Cursor_base repo (or a checkout with `scripts/`, `manifest.json`, `skills/`)
- [ ] Scripts executable: `chmod +x scripts/*.sh hooks/scripts/*.sh`
- [ ] **Optional:** `CURSOR_API_KEY` in Cloud Agents → Secrets to fetch cloud agent chat transcripts via API (see `cloud/secrets-guide.md`)

## Phase 1 — Inventory current capabilities

Run automated checks first; read docs only when checks fail or counts look stale.

| Step | Command / action | What to capture |
|------|------------------|-----------------|
| Asset inventory | `./scripts/list-assets.sh --json` | Counts and paths for rules, skills, agents, hooks, profiles |
| Structure validation | `./scripts/validate.sh` | Frontmatter, manifest paths, hook tests |
| Bootstrap sync | `./scripts/check-bootstrap-sync.sh` | Source vs `.cursor/` drift |
| E2E smoke | `./scripts/dogfood-test.sh` | Bootstrap-to-temp, layered profiles, hook matrix |
| Manifest review | Read `manifest.json` | Compare listed skills/agents to `list-assets.sh` output |
| Profile layers | `./scripts/list-profile-layers.sh` | Parent/child layer catalog |
| Known baselines | Skim `docs/cloud-agent-ux-review.md`, `docs/cloud-mcp-gap-analysis.md` | Documented gaps and superseded notes |

**Drift checks** — flag when:

- `manifest.json` lists an asset that is missing on disk
- A source skill/agent exists under `skills/` or `agents/` but is absent from `manifest.json`
- `.cursor/` differs from source after `bootstrap-self.sh` (sync issue)

Stop when you can answer: *What assets ship today? Which automated checks pass or fail?*

## Phase 2 — Assess effectiveness

Evaluate how well the current profile performs — not just whether files exist.

### Automated signals

| Signal | How to check | Upgrade hint |
|--------|--------------|--------------|
| Hook enforcement | `dogfood-test.sh` hook matrix; `./scripts/analyze-deny-log.sh` on deny-log; live deny messages in chats | Tighten rules or add skill guidance when agents repeatedly hit the same deny |
| Bootstrap reliability | Temp-dir bootstrap in `dogfood-test.sh` | Fix scripts or templates when layout checks fail |
| Cloud readiness | `./scripts/verify-cloud-readiness.sh --target . --warn` | Template or AGENTS.md gaps |
| Profile verification | `./scripts/verify-cursor-profile.sh --target .` | Missing `.cursor/` trees or invalid JSON |

### Manual effectiveness review

For each asset category, note **worked**, **partial**, or **blocked**:

| Category | Review focus |
|----------|--------------|
| Rules | Were they followed? Too vague? Depend on unavailable tools? |
| Skills | Invoked when expected? Steps accurate? Missing prerequisites? |
| Agents | Task subagent registered? Readonly reviewers actionable? |
| Hooks | False positives? Missing dangerous-pattern coverage? |
| Scripts | Idempotent? Documented in AGENTS.md? |
| Docs | Superseded content? Actionable for cloud agents? |

Delegate a skeptical inventory pass to the **verifier** subagent when the task is validation-heavy (skip implementation-focused efficiency audits).

Record findings with file paths and evidence — see [references/chat-analysis-rubric.md](references/chat-analysis-rubric.md).

## Phase 3 — Analyze the last 10 agent chats

Gather up to **10 recent cloud agent sessions across all repos** — including Cursor_base itself and consumers bootstrapped via `bootstrap-cursor.sh` or `update-cursor-base.sh`. Consumer sessions surface post-deploy friction that repo-only analysis misses.

### Source priority

1. **Cursor Cloud Agents API (preferred)** — When `CURSOR_API_KEY` is set:
   ```bash
   ./scripts/verify-cursor-api.sh
   ./scripts/fetch-recent-cloud-agent-chats.sh --limit 10 --json --efficiency
   ```
   - Lists the 10 most recent cloud agent sessions via [Cloud Agents API](https://cursor.com/docs/cloud-agent/api/endpoints) (`GET /v1/agents`)
   - Fetches full user/assistant messages per session (`GET /v0/agents/{id}/conversation`) when available
   - Falls back to run summaries (`GET /v1/agents/{id}/runs/{runId}`) when conversation history is unavailable
   - Optional: add `--repo Cursor_base` (or any substring) to narrow to one repository's GitHub URL
   - Create the API key at Cursor Dashboard → API Keys; store as dashboard secret `CURSOR_API_KEY`
2. **Linear** — If Linear MCP is available (complements API data, especially for issue-linked sessions):
   - `list_issues` with `project: "Cursor Base"`, `delegate: "Cursor"`, `orderBy: "updatedAt"`, `limit: 10`
   - For each issue: `get_issue` and read description, comments, and embedded **message history**
3. **Local dogfood reports** — `docs/*-report.md`, `docs/*-review.md`, `docs/OTT-14-linear-issues.csv`
4. **GitHub** — Recent PRs on this repo opened by cloud agents (bodies often summarize what worked/failed)
5. **User-provided** — Pasted chat exports or explicit agent URLs (`https://cursor.com/agents/bc-...`)

Merge API and Linear sources; deduplicate by agent URL or issue ID. If fewer than 10 unique sessions exist, analyze what is available and note the sample size in the plan.

### Per-chat analysis

For each session, extract:

| Field | Notes |
|-------|-------|
| Session ID | Linear issue ID, PR link, or report filename |
| Task type | Setup, feature, bugfix, inventory, dogfood |
| Assets touched | Rules/skills/agents/hooks referenced or needed |
| Outcome | Success, partial, blocked |
| Friction | Repeated mistakes, hook blocks, wrong subagent, missing docs |
| Upgrade candidate | Concrete asset change (not vague "improve docs") |

Use the rubric in [references/chat-analysis-rubric.md](references/chat-analysis-rubric.md) for consistent scoring. Score the **Token efficiency** dimension explicitly; use `--efficiency` on the fetch script for heuristic signals when tool args are not in the API.

**Privacy:** Do not paste secrets, tokens, or private URLs into committed files. Summarize chat findings; redact credentials.

## Phase 4 — Synthesize the upgrade plan

Merge Phase 1–3 into one prioritized plan. Use [references/upgrade-plan-template.md](references/upgrade-plan-template.md).

### Prioritization

| Priority | Criteria | Examples |
|----------|----------|----------|
| **P0** | Blocks cloud agents or CI; safety gap | Broken bootstrap, hook bypass, validate.sh failure |
| **P1** | Recurring friction in ≥2 chats or failed dogfood | Missing skill, stale rule, unregistered subagent |
| **P2** | Quality, docs, or single-session nit | Wording, optional template merge |
| **Won't fix** | Platform limitation outside repo | MCP tool not exposed by Cursor runtime |

Group items by asset type (rules, skills, agents, hooks, scripts, docs, profiles).

Each item must include:

- **Evidence** — issue ID, chat excerpt summary, or script output
- **Proposed change** — specific file(s) and action
- **Verification** — command or manual step to confirm the fix

Present the plan to the user before implementing unless they asked for autonomous fixes.

### Optional: file Linear issues

When the user wants tracking, create issues in the **Cursor Base** project with labels matching priority. Link back to the upgrade plan section.

## Phase 5 — Implement (only when requested)

If the user approves items from the plan:

1. Create a feature branch; minimize scope per item
2. Edit source assets under `rules/`, `skills/`, `agents/`, `hooks/`, `scripts/` — not only `.cursor/`
3. Run `./scripts/validate.sh` and `./scripts/bootstrap-self.sh`
4. Run `./scripts/check-bootstrap-sync.sh`
5. Use the `create-pr` skill to open a PR (ready for review by default)

## Quick invocation

**Plan only (default):**

```
Run plan-cursor-base-upgrades: inventory assets, assess effectiveness, analyze last 10 Cursor agent chats across all repos, output prioritized upgrade plan.
```

**Plan + top P0 fix:**

```
Run plan-cursor-base-upgrades, then implement the highest-priority P0 item only.
```

## Related assets

| Asset | Role |
|-------|------|
| `expand-layer-profile` | Parent/child lifecycle expansions under `profiles/layers/` |
| `create-repo-cursor-pack` | Project-local packs for consumer repos — not global profile upgrades |
| `cloud-readiness-auditor` | Consumer repo cloud setup audit |
| `verifier` | Skeptical validation after implementation |
| `docs/OTT-14-asset-test-report.md` | Example dogfood effectiveness table |
