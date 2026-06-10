---
name: explore-codebase
description: Efficiently find code, definitions, and patterns in a repository. Use when searching for where something is defined, how a feature works, or locating files by name or content.
---

# Explore Codebase

## Search strategy (in order)

1. **Known file path** — Read the file directly.
2. **Symbol or string** — Grep for the exact name or pattern.
3. **File by name** — Glob for filename patterns (e.g. `**/*auth*`).
4. **Narrow reconnaissance** — Task tool with `subagent_type: lightweight-explorer` when the question is specific but spans a few files.
5. **Broad exploration** — Task tool with `subagent_type: explore` only when the search space is large and unclear.

## Task subagent registration

`lightweight-explorer` ships in `agents/lightweight-explorer.md`. Bootstrap copies it to `.cursor/agents/`, where Cursor registers the `name` field as a valid Task `subagent_type`. Consumer repos and cloud VMs must run bootstrap (or `bootstrap-self.sh` in Cursor_base) before Task can dispatch this subagent.

## Fallback when lightweight-explorer is unavailable

If Task rejects `subagent_type: lightweight-explorer`, **try direct Grep/Read first** — one or two capped tool calls are usually cheaper than any subagent. Only then use `subagent_type: explore` with thoroughness `quick`. Do not launch `explore` when you already know the path or symbol.

## Efficiency rules

- Run independent searches in parallel (multiple Grep/Read/Glob calls in one message).
- Do not re-read files already in context unless they may have changed.
- For large files, use offset/limit to read only relevant sections.
- Stop once you have enough context to answer or act — avoid redundant passes.
- Prefer `files_with_matches` Grep mode when you only need file paths.

## When to use lightweight-explorer

Use the lightweight-explorer subagent when:

- You need to find a symbol, path, or pattern across a few directories.
- The question is narrow but would take multiple Grep/Read steps.
- A full explore survey would be overkill.

Do **not** use it for single known-path reads or one Grep call you can do directly.

## When to use subagent explore

Use the explore subagent when:

- You need to survey an unfamiliar codebase structure.
- The search spans many directories or naming conventions.
- You are not sure which keyword or path to start with.

Do **not** use it for:

- Finding a specific class, function, or file you can name.
- Reading a file you already know the path to.

## Reporting results

- Cite code with ```startLine:endLine:filepath blocks.
- Summarize findings before proposing changes.
- Note uncertainty if search results are ambiguous.
