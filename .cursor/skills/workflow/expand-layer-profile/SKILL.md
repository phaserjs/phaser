---
name: expand-layer-profile
description: Expand a parent or child profile layer to full lifecycle coverage. Use when adding rules, skills, and agents to profiles/layers/, mirroring the python or writing v1.2.0 packs.
---

# Expand Layer Profile

Workflow for expanding a **parent** (`profiles/layers/parents/<name>/`) or **child** (`profiles/layers/children/<name>/`) profile layer.

Reference implementations:

- Child: `profiles/layers/children/python/` (v1.2.0)
- Parent: `profiles/layers/parents/writing/` (v1.2.0)

## Phase 1 — Assess gaps

1. Read the layer `manifest.json` and list existing rules, skills, and agents.
2. Read the sibling reference profile above; note the lifecycle router + specialist skills pattern.
3. Check `profiles/layers/catalog.json` description and parent `children_compatible` if child work.
4. Skim `profiles/layers/consumer-repos.json` for repos that use this layer.

## Phase 2 — Design assets

### Required for full lifecycle (child stack layers)

| Asset | Purpose |
|-------|---------|
| `<stack>-project-lifecycle` skill | Router — table of stages → specialist skills |
| `<stack>-tooling` skill | Install, build, lint, preview, or doc-site commands |
| Feature/content workflow skill | Primary production work for the stack |
| Debug/triage skill | Stack-specific failure modes |
| Release/deploy skill | Ship, export, or publish (or link to parent) |
| 2–3 scoped rules | Conventions, testing, packaging/API tone |
| `<stack>-quality-reviewer` agent | Readonly pre-merge review |

Delegate language-agnostic stages to the **parent** layer (e.g. `onboard-to-codebase`, `plan-technical-change`, `deploy-and-release` under `programming`).

### Required for full lifecycle (parent domain layers)

| Asset | Purpose |
|-------|---------|
| `<domain>-project-lifecycle` skill | Router across discover → plan → produce → ship → maintain |
| Stage skills | One skill per major lifecycle stage |
| 2–4 domain rules | Process, quality, maintenance |
| Optional reviewer agent | Readonly pre-publish or pre-merge review |

### Cross-links

- Lifecycle router links to every specialist skill and relevant parent skills.
- Specialist skills link back to the router and parent workflows.
- Rules reference skills where workflow matters.

## Phase 3 — Implement

1. Add assets under the layer tree (`rules/`, `skills/`, `agents/`).
2. Bump layer `manifest.json` version (minor for expansion, e.g. 1.0.0 → 1.2.0).
3. Update `profiles/layers/catalog.json` description.
4. Add layered bootstrap assertions to `scripts/dogfood-test.sh`.
5. Add a `CHANGELOG.md` bullet under `## [Unreleased] → ### Added — <layer name>` (use a **dedicated subsection** when multiple layer PRs run in parallel).
6. Update `profiles/layers/consumer-repos.json` notes if consumer impact changes.

Do **not** edit only `.cursor/` — source assets live under `profiles/layers/` and global `skills/` / `rules/`.

## Phase 4 — Verify

```bash
./scripts/validate.sh
./scripts/dogfood-test.sh
./scripts/bootstrap-cursor.sh --target /tmp/layer-smoke --parent <parent> --child <child>  # when child
./scripts/verify-cursor-profile.sh --target /tmp/layer-smoke
```

## Phase 5 — Ship

1. Feature branch off `main`; clear commit messages with Linear ID when applicable.
2. Open a PR (ready for review by default); note manifest version and asset counts in the description.
3. Run `bootstrap-self.sh` only if global profile sources changed (not required for layer-only work).

## Parallel PR guidance

When multiple agents expand different layers concurrently:

- Prefer **per-layer changelog subsections** instead of competing edits to the same `### Added` list.
- Alternatively **serialize merges** through `main` before starting the next layer expansion.
- `CHANGELOG.md` conflicts from parallel `[Unreleased]` bullets are usually simple — keep all entries from both sides.

## Linear issue template

When filing tracking issues, use `docs/layer-expansion-issue-template.md`.
