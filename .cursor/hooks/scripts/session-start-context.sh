#!/usr/bin/env bash
# Deferred sessionStart hook — inject lean routing context at session start.
# NOT registered in hooks/hooks.json until Cloud Agents support sessionStart.
#
# Receives JSON on stdin per Cursor sessionStart protocol.
# Exit 0 with JSON containing additional_context when supported.

set -euo pipefail

INPUT=$(cat)

python3 - "$INPUT" <<'PY'
import json
import sys

try:
    json.loads(sys.argv[1])
except json.JSONDecodeError:
    print(json.dumps({}))
    sys.exit(0)

context = (
    "Cursor_base efficiency defaults: use Grep with head_limit, Read with offset/limit, "
    "targeted StrReplace edits. Read AGENTS.md Cloud section before install/test. "
    "Optional MCP only when project requires external systems."
)
print(json.dumps({"additional_context": context}))
PY
