# Cursor_base upgrade plan template

Copy this structure into the agent response or a `docs/` report when completing Phase 4.

```markdown
# Cursor_base upgrade plan

**Date:** YYYY-MM-DD  
**Repo / branch:** <path> @ <branch>  
**Analyst:** <agent or human>  
**Chat sample:** <N> sessions (target 10)

## Executive summary

<2–4 sentences: overall health, top themes, recommended next action>

## Capability snapshot

| Check | Result |
|-------|--------|
| `list-assets.sh --json` | rules: N, skills: N, agents: N, … |
| `validate.sh` | Pass / Fail — <notes> |
| `check-bootstrap-sync.sh` | Pass / Fail |
| `dogfood-test.sh` | Pass / Fail — <notes> |
| Manifest drift | None / <items> |

## Effectiveness highlights

### Working well

- <asset> — <evidence>

### Partial or blocked

- <asset> — <symptom> — <evidence>

## Chat analysis summary

| # | Session | Task | Outcome | Key friction |
|---|---------|------|---------|--------------|
| 1 | OTT-XX | … | ✅ / ⚠️ / ❌ | … |
| … | | | | |

**Recurring themes:** <bullets>

## Proposed upgrades

### P0 — Blockers

- [ ] **<title>** — <proposed change>  
  - Evidence: <issue / chat / script>  
  - Verify: `<command>`

### P1 — High value

- [ ] **<title>** — …

### P2 — Improvements

- [ ] **<title>** — …

### Won't fix (platform)

- <item> — <reason>

## Recommended execution order

1. <first PR scope>
2. <second PR scope>
3. …

## Open questions

- <anything needing user decision>
```

## Filing guidance

- One PR per theme when possible (e.g. hooks, skills, docs) — easier review than a mega-PR
- Reference Linear issue IDs in commit messages: `OTT-55: add plan-cursor-base-upgrades skill`
- After shipping, re-run Phase 1 checks to confirm the snapshot improved
