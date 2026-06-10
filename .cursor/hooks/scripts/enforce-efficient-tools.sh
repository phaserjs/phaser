#!/usr/bin/env bash
# Enforce context and token efficiency on high-output built-in tools.
# Receives JSON on stdin per Cursor preToolUse protocol.
# Exit 0 to allow; exit 2 to deny with JSON on stdout.

set -euo pipefail

INPUT=$(cat)

python3 - "$INPUT" <<'PY'
import json
import os
import re
import sys
from datetime import datetime, timezone

try:
    payload = json.loads(sys.argv[1])
except json.JSONDecodeError:
    print(json.dumps({"permission": "allow"}))
    sys.exit(0)

tool_name = payload.get("tool_name", "")
tool_input = payload.get("tool_input") or {}

LARGE_FILE_LINES = 300
UNSCOPED_GLOB = re.compile(r"^(\*\*?/?\*?|\*\*/\*\*?|\*\*/\*|\*)$")


def log_deny(reason: str) -> None:
    log_path = os.environ.get("EFFICIENCY_DENY_LOG", ".cursor/hooks/deny-log.jsonl")
    if not log_path:
        return
    entry = {
        "ts": datetime.now(timezone.utc).isoformat(),
        "tool": tool_name,
        "reason": reason,
    }
    try:
        os.makedirs(os.path.dirname(log_path) or ".", exist_ok=True)
        with open(log_path, "a", encoding="utf-8") as fh:
            fh.write(json.dumps(entry) + "\n")
    except OSError:
        pass


def deny(user_message: str, agent_message: str, reason: str = "") -> None:
    log_deny(reason or user_message)
    out = {
        "permission": "deny",
        "user_message": user_message,
        "agent_message": agent_message,
    }
    print(json.dumps(out))
    sys.exit(2)


def file_line_count(path: str) -> int | None:
    if not path or not os.path.isfile(path):
        return None
    try:
        with open(path, "rb") as fh:
            return sum(1 for _ in fh)
    except OSError:
        return None


if tool_name == "Grep":
    pattern = tool_input.get("pattern", "")
    head_limit = tool_input.get("head_limit")
    output_mode = tool_input.get("output_mode", "content")

    if output_mode == "content" and head_limit is None:
        deny(
            "Blocked Grep content mode without head_limit.",
            (
                "Grep content mode requires head_limit (e.g. 50). "
                "Use output_mode files_with_matches when you only need paths, "
                "or set head_limit to cap line output."
            ),
            "grep_no_head_limit",
        )

elif tool_name == "Glob":
    glob_pattern = (tool_input.get("glob_pattern") or "").strip()
    if UNSCOPED_GLOB.match(glob_pattern):
        deny(
            "Blocked unscoped Glob pattern.",
            (
                f"Glob pattern '{glob_pattern}' is too broad. "
                "Narrow with a directory prefix (e.g. src/**/*.ts) "
                "or use Grep files_with_matches."
            ),
            "unscoped_glob",
        )
    if glob_pattern.startswith("**") and "/" not in glob_pattern.lstrip("*").lstrip("/"):
        deny(
            "Blocked unscoped Glob pattern.",
            (
                f"Glob pattern '{glob_pattern}' spans the whole tree. "
                "Add a directory prefix (e.g. src/**/*.ts)."
            ),
            "unscoped_glob",
        )

elif tool_name == "Read":
    path = tool_input.get("path", "")
    limit = tool_input.get("limit")
    offset = tool_input.get("offset")

    if limit is None and offset is None:
        lines = file_line_count(path)
        if lines is not None and lines > LARGE_FILE_LINES:
            deny(
                f"Blocked full Read of large file ({lines} lines).",
                (
                    f"File has {lines} lines. Use Read offset/limit for the section you need, "
                    "or Grep with head_limit to locate relevant lines. "
                    "Full-file Read is only appropriate for small files or when editing."
                ),
                "large_read",
            )

elif tool_name == "Shell":
    command = tool_input.get("command", "")

    if re.search(r"\b(curl|wget)\b", command):
        deny(
            "Blocked curl/wget in shell.",
            "Use WebSearch for web content, not curl or wget in shell.",
            "curl_wget",
        )

    cat_match = re.search(r"\bcat\b(?:\s+-[A-Za-z]+\s*)*\s+(\S+)", command)
    if cat_match and "|" not in command:
        target = cat_match.group(1).strip("'\"")
        lines = file_line_count(target)
        if lines is not None and lines > 50:
            deny(
                "Blocked cat on large file.",
                (
                    f"cat on {target} ({lines} lines) floods context. "
                    "Use Read with offset/limit, sed -n 'L,Mp', or grep -n with head_limit."
                ),
                "cat_large",
            )

    if re.search(r"\bfind\b", command) and not re.search(r"\b(-name|-type|-maxdepth|-path)\b", command):
        if re.search(r"\bfind\s+(/|\.)?\s*$", command) or re.search(r"\bfind\s+\.\s*$", command):
            deny(
                "Blocked unscoped find.",
                "find without -name, -type, or -maxdepth dumps huge output. Add scope or use Glob.",
                "unscoped_find",
            )

    if re.search(r"\bls\b", command) and re.search(r"-\w*R", command):
        deny(
            "Blocked recursive ls.",
            "ls -R dumps huge directory trees. Use Glob with a pattern or find with -name/-maxdepth.",
            "ls_recursive",
        )

    if re.search(r"\btree\b", command):
        deny(
            "Blocked tree command.",
            "tree dumps entire directory structures. Use Glob or scoped find instead.",
            "tree",
        )

    if re.search(r"\bgit\s+log\b", command):
        if not re.search(r"(--max-count|-n\s+\d+|-\d+\b|--oneline\s+-)", command):
            deny(
                "Blocked unbounded git log.",
                "git log without -n or --max-count floods context. Use git log -n 20 or a path scope.",
                "git_log_unbounded",
            )

    if re.search(r"\bgrep\b.*\s-[rR]\b", command):
        has_m = bool(re.search(r"(?:\s|^)-m\s*\d+", command))
        has_head_pipe = bool(re.search(r"\|\s*head\b", command))
        if not has_m and not has_head_pipe:
            grep_r = re.search(
                r"\bgrep\b(?:\s+-[^\s]+)*\s+-[rR]\b(?:\s+-[^\s]+)*\s+\S+\s+(\S+)\s*$",
                command,
            )
            search_path = grep_r.group(1).strip("'\"") if grep_r else ""
            scoped = search_path not in ("", ".", "/")
            if not scoped:
                deny(
                    "Blocked recursive grep without output cap.",
                    (
                        "grep -r/-R without -m NUM floods context. "
                        "Use -m 50, pipe to head, or scope to a subdirectory."
                    ),
                    "grep_recursive_unbounded",
                )

    if re.search(r"\brg\b", command):
        has_cap = bool(re.search(r"(?:\s|^)(?:-m|--max-count)\s+\d+", command))
        if not has_cap:
            stripped = command.strip()
            if re.search(r"\brg\s+(\.|''|\"\"|'')\s*$", stripped):
                deny(
                    "Blocked repo-wide rg without cap.",
                    "rg . without -m/--max-count floods context. Use -m 50 or narrow the path.",
                    "rg_unbounded",
                )
            # rg PATTERN with no trailing path (repo-wide search)
            rg_parts = re.match(
                r"rg(?:\s+(?:-[a-zA-Z]+(?:\s+\S+)?|--[a-zA-Z-]+(?:=\S+)?\s*)*)*\s+(\S+)(?:\s+(.+))?$",
                stripped,
            )
            if rg_parts:
                pattern = rg_parts.group(1)
                path_tail = (rg_parts.group(2) or "").strip()
                if (
                    not pattern.startswith("-")
                    and pattern not in (".", "''", '""')
                    and not path_tail
                ):
                    deny(
                        "Blocked rg without output cap.",
                        (
                            "rg without -m/--max-count can flood context. "
                            "Add -m 50 or scope to a subdirectory."
                        ),
                        "rg_unbounded",
                    )

elif tool_name in ("WebFetch", "mcp_web_fetch"):
    deny(
        "Blocked WebFetch.",
        (
            "WebFetch is blocked by the efficiency hook to save context tokens. "
            "Use WebSearch for web research, or add a project-specific fetch MCP "
            "via the Cloud Agents dashboard when full page content is required."
        ),
        "webfetch",
    )

print(json.dumps({"permission": "allow"}))
PY
