---
name: manage-context
description: Keep conversation context lean during long or multi-step tasks. Use when a thread is long, you have already gathered substantial context, or you are resuming work across many files.
---

# Manage Context

Key bullets from this skill are also in the always-applied `explore-efficiently` rule. Use this skill for long or multi-step threads that need fuller discipline.

## Track what you know

Before fetching more data, state (internally) what is already established:

- Which files and symbols are relevant.
- What the user asked for and what is already done.
- Open questions that still need answers.

Do not re-read or re-search for information already in the thread unless files may have changed.

## Fetch incrementally

1. Start with the smallest query that could answer the question.
2. Expand scope only when results are insufficient.
3. Stop as soon as you can act — avoid "just in case" exploration.

## Summarize before expanding

When tool output is large:

- Extract only lines or facts needed for the task.
- Do not paste full tool output into your response.
- Reference paths and line ranges instead of duplicating code already cited.

## Long threads

- Prefer citing prior conclusions over re-explaining them.
- When switching subtasks, briefly note what carries over and what is new.
- Avoid restating user rules, system instructions, or skill text back to the user.

## When files may have changed

Re-read only:

- Files you or the user edited since last read.
- Files where another agent or parallel step may have modified content.
- Lock files or generated artifacts when diagnosing build failures.

## Delegation cost

Use Task with `subagent_type: lightweight-explorer` for narrow multi-file questions (requires bootstrapped `.cursor/agents/lightweight-explorer.md`). If Task rejects that type on Cloud Agents, fall back to `subagent_type: explore` with thoroughness `quick`. Use the explore subagent only when the search space is large and unclear. For named symbols, paths, or single-step queries, use direct Grep/Read — subagent overhead often costs more tokens than a targeted search.
