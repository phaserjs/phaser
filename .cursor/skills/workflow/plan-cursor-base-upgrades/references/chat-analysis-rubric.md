# Chat analysis rubric

Use when scoring each agent session in Phase 3 of `plan-cursor-base-upgrades`.

## Session metadata

| Field | Required |
|-------|----------|
| Identifier | Linear `OTT-XX`, PR URL, or report path |
| Date | ISO date or approximate |
| Environment | Cloud agent / local IDE / consumer repo |
| Profile scope | Global only / global + layer (`programming`, `react-web-app`, etc.) |

## Scoring dimensions (1–3 each)

| Score | Meaning |
|-------|---------|
| 1 | Poor — asset missing, wrong, or actively harmful |
| 2 | Mixed — partially followed or workaround needed |
| 3 | Good — followed without friction |

| Dimension | What to look for |
|-----------|------------------|
| **Rule adherence** | `communication`, `explore-efficiently`, `minimize-scope`, etc. |
| **Skill selection** | Correct skill invoked; steps match SKILL.md |
| **Tool efficiency** | Hook denials, broad grep/read, redundant exploration |
| **Token efficiency** | Capped Grep/Read (`head_limit`, offset/limit), parallel independent tools, lean summaries vs dumps, no re-quoted issue payloads, WebSearch over WebFetch |
| **Subagent use** | Correct `subagent_type`; fallback documented when rejected |
| **Outcome quality** | Task completed, PR opened, validation run |
| **Cloud fit** | AGENTS.md, environment.json, secrets handled correctly |

**Session score** = average of dimensions (report to one decimal).

## Friction tags

Apply all that fit; these drive upgrade candidates:

| Tag | Upgrade direction |
|-----|-------------------|
| `missing-skill` | Add or extend SKILL.md |
| `stale-rule` | Update or remove rule; note platform changes |
| `hook-deny-loop` | Agent retried blocked pattern — clarify rule or skill |
| `subagent-rejected` | Document fallback; fix agent frontmatter if misconfigured |
| `manifest-drift` | Sync manifest.json with filesystem |
| `doc-superseded` | Add superseded note or refresh doc |
| `script-failure` | Fix script or document prerequisite |
| `platform-gap` | Document in `hooks/cursor-platform-capabilities.md`; Won't fix if external |
| `over-scoped` | Strengthen `minimize-scope` examples or task skill |
| `under-scoped` | Missing verifier/reviewer step in workflow skill |
| `token-waste` | Full-file reads, unbounded shell, WebFetch retries, pasted Notion/issue bodies |
| `hook-deny-waste` | Retried same blocked pattern after deny instead of adjusting tool args |

## Evidence capture

For each friction tag, record:

1. **Quote or paraphrase** — one sentence from the session (no secrets)
2. **Asset path** — e.g. `skills/cloud/cloud-agent-setup/SKILL.md`
3. **Proposed fix** — imperative, testable

## Example row

| Dimension | Score | Note |
|-----------|-------|------|
| Rule adherence | 3 | Used code citations consistently |
| Skill selection | 2 | Used `explore` instead of `lightweight-explorer` after rejection |
| Tool efficiency | 3 | Parallel grep, head_limit used |
| Token efficiency | 3 | Summarized tool output; no LINEAR_ISSUE re-quotes |
| Subagent use | 2 | `lightweight-explorer` rejected; fallback worked |
| Outcome quality | 3 | validate.sh pass, PR opened |
| Cloud fit | 3 | bootstrap-self run |

**Tags:** `subagent-rejected`  
**Upgrade:** Ensure `explore-codebase` fallback is prominent; track platform registration of `lightweight-explorer`.

## Minimum sample

- Target **10** chats; if fewer exist, state count and bias (e.g. "all cloud-agent issues from last 30 days")
- **Primary source:** `./scripts/fetch-recent-cloud-agent-chats.sh --limit 10 --efficiency` when `CURSOR_API_KEY` is set — returns transcripts plus per-session token-efficiency heuristics (add `--repo` to narrow); not just Linear summaries
- **Secondary:** Linear **delegate: Cursor** issues on **Cursor Base** project for issue context and tasks without API access
