#!/usr/bin/env bash
# Blocks obviously dangerous shell commands from agent execution.
# Receives JSON on stdin per Cursor hooks protocol.
# Exit 0 to allow; exit 2 to deny with JSON on stdout.

set -euo pipefail

INPUT=$(cat)

python3 - "$INPUT" <<'PY'
import json
import re
import sys

try:
    payload = json.loads(sys.argv[1])
except json.JSONDecodeError:
    print(json.dumps({"permission": "allow"}))
    sys.exit(0)

command = payload.get("command", "")

if not command:
    print(json.dumps({"permission": "allow"}))
    sys.exit(0)

# Match protected branch refs exactly (main/master), not names like main-backup.
PROTECTED_BRANCH = r"(main|master)(;|\s|$)"

BLOCK_RULES = [
    (
        re.compile(r"rm\s+-rf\s+/(;|\s|$)"),
        "Blocked rm -rf on filesystem root.",
        "Refusing to delete the root filesystem. Use a scoped path such as /tmp or a project directory.",
    ),
    (
        re.compile(r"rm\s+-rf\s+~"),
        "Blocked rm -rf on home directory.",
        "Refusing to delete the home directory. Target a specific subdirectory instead.",
    ),
    (
        re.compile(rf"git\s+push\s+.*--force.*\s+{PROTECTED_BRANCH}"),
        "Blocked force push to protected branch.",
        "Force pushing to main or master is not allowed. Push to a feature branch and open a pull request.",
    ),
    (
        re.compile(rf"git\s+push\s+-f\s+(origin\s+)?{PROTECTED_BRANCH}"),
        "Blocked force push to protected branch.",
        "Force pushing to main or master is not allowed. Push to a feature branch and open a pull request.",
    ),
    (
        re.compile(rf"git\s+push\s+.*\+{PROTECTED_BRANCH}"),
        "Blocked force push to protected branch.",
        "Force pushing to main or master is not allowed. Push to a feature branch and open a pull request.",
    ),
    (
        re.compile(rf"git\s+push\s+.*HEAD:{PROTECTED_BRANCH}"),
        "Blocked force push to protected branch.",
        "Force pushing to main or master is not allowed. Push to a feature branch and open a pull request.",
    ),
    (
        re.compile(rf"git\s+push\s+.*:{PROTECTED_BRANCH}"),
        "Blocked force push to protected branch.",
        "Force pushing to main or master is not allowed. Push to a feature branch and open a pull request.",
    ),
    (
        re.compile(r":\(\)\{ :\|:& \};:"),
        "Blocked fork bomb.",
        "This command pattern is not allowed.",
    ),
    (
        re.compile(r"mkfs\."),
        "Blocked filesystem format command.",
        "Formatting filesystems is not allowed in agent shell execution.",
    ),
    (
        re.compile(r"dd\s+if="),
        "Blocked raw disk write (dd).",
        "Direct disk writes with dd are not allowed in agent shell execution.",
    ),
]


def deny(user_message: str, agent_message: str) -> None:
    out = {
        "permission": "deny",
        "user_message": user_message,
        "agent_message": agent_message,
    }
    print(json.dumps(out))
    sys.exit(2)


for pattern, user_message, agent_message in BLOCK_RULES:
    if pattern.search(command):
        deny(user_message, agent_message)

print(json.dumps({"permission": "allow"}))
PY
