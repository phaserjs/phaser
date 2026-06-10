#!/usr/bin/env bash
# Allow/deny matrix tests for enforce-efficient-tools.sh
#
# Usage: ./hooks/scripts/test-enforce-efficient-tools.sh

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
HOOK="$ROOT/hooks/scripts/enforce-efficient-tools.sh"
FIXTURE_DIR="$(mktemp -d "${TMPDIR:-/tmp}/enforce-efficient-tools-test.XXXXXX")"
export EFFICIENCY_DENY_LOG="$FIXTURE_DIR/deny-log.jsonl"

cleanup() {
  rm -rf "$FIXTURE_DIR"
}
trap cleanup EXIT

FAILURES=0
TESTS=0

make_input() {
  python3 -c "import json,sys; print(json.dumps({'tool_name': sys.argv[1], 'tool_input': json.loads(sys.argv[2])}))" "$1" "$2"
}

hook_exit_code() {
  local exit_code=0
  make_input "$1" "$2" | bash "$HOOK" >/dev/null 2>/dev/null || exit_code=$?
  echo "$exit_code"
}

run_hook() {
  make_input "$1" "$2" | bash "$HOOK" 2>/dev/null || true
}

expect_block() {
  local tool="$1"
  local input="$2"
  local desc="${3:-$tool}"
  TESTS=$((TESTS + 1))
  local exit_code
  exit_code=$(hook_exit_code "$tool" "$input")
  if [[ "$exit_code" -ne 2 ]]; then
    echo "FAIL [block]: $desc (exit $exit_code, expected 2)" >&2
    FAILURES=$((FAILURES + 1))
    return
  fi

  local output
  output=$(run_hook "$tool" "$input")
  if ! python3 -c "
import json, sys
data = json.loads(sys.argv[1])
assert data.get('permission') == 'deny', data
assert isinstance(data.get('user_message'), str) and data['user_message'], data
assert isinstance(data.get('agent_message'), str) and data['agent_message'], data
" "$output" 2>/dev/null; then
    echo "FAIL [block-json]: $desc (invalid deny JSON: $output)" >&2
    FAILURES=$((FAILURES + 1))
  fi
}

expect_allow() {
  local tool="$1"
  local input="$2"
  local desc="${3:-$tool}"
  TESTS=$((TESTS + 1))
  local exit_code
  exit_code=$(hook_exit_code "$tool" "$input")
  if [[ "$exit_code" -ne 0 ]]; then
    echo "FAIL [allow]: $desc (exit $exit_code, expected 0)" >&2
    FAILURES=$((FAILURES + 1))
    return
  fi

  local output
  output=$(run_hook "$tool" "$input")
  if ! python3 -c "
import json, sys
data = json.loads(sys.argv[1])
assert data.get('permission') == 'allow', data
" "$output" 2>/dev/null; then
    echo "FAIL [allow-json]: $desc (invalid allow JSON: $output)" >&2
    FAILURES=$((FAILURES + 1))
  fi
}

if [[ ! -x "$HOOK" ]]; then
  echo "ERROR: hook not found or not executable: $HOOK" >&2
  exit 1
fi

# Fixture: large file (>300 lines)
LARGE_FILE="$FIXTURE_DIR/large.txt"
python3 -c "print('\n'.join(f'line {i}' for i in range(1, 401)))" >"$LARGE_FILE"

# Fixture: small file
SMALL_FILE="$FIXTURE_DIR/small.txt"
printf 'one\ntwo\nthree\n' >"$SMALL_FILE"

echo "Running enforce-efficient-tools.sh tests..."

# Grep
expect_block "Grep" '{"pattern":".*","output_mode":"content"}' "broad grep without head_limit"
expect_block "Grep" '{"pattern":"class Foo","output_mode":"content"}' "narrow grep content without head_limit"
expect_allow "Grep" '{"pattern":".*","output_mode":"content","head_limit":50}' "broad grep with head_limit"
expect_allow "Grep" '{"pattern":"class Foo","output_mode":"content","head_limit":20}' "narrow grep with head_limit"
expect_allow "Grep" '{"pattern":"foo","output_mode":"files_with_matches"}' "narrow grep files_with_matches"
expect_allow "Grep" '{"pattern":".","output_mode":"content","head_limit":10}' "dot pattern with head_limit"

# Glob
expect_block "Glob" '{"glob_pattern":"**/*"}' "unscoped glob **/*"
expect_block "Glob" '{"glob_pattern":"*"}' "unscoped glob *"
expect_allow "Glob" '{"glob_pattern":"src/**/*.ts"}' "scoped glob with directory prefix"

# Read
expect_block "Read" "{\"path\":\"$LARGE_FILE\"}" "full read of large file"
expect_allow "Read" "{\"path\":\"$LARGE_FILE\",\"offset\":1,\"limit\":50}" "partial read of large file"
expect_allow "Read" "{\"path\":\"$SMALL_FILE\"}" "full read of small file"

# Shell
expect_block "Shell" '{"command":"curl https://example.com"}' "curl in shell"
expect_block "Shell" '{"command":"wget https://example.com"}' "wget in shell"
expect_allow "Shell" '{"command":"ls -la"}' "normal shell command"
expect_block "Shell" "{\"command\":\"cat $LARGE_FILE\"}" "cat on large file"
expect_allow "Shell" "{\"command\":\"cat $SMALL_FILE\"}" "cat on small file"
expect_block "Shell" '{"command":"find ."}' "unscoped find"
expect_allow "Shell" '{"command":"find . -name \"*.sh\""}' "scoped find with -name"
expect_block "Shell" '{"command":"ls -R ."}' "recursive ls"
expect_allow "Shell" '{"command":"ls -la"}' "non-recursive ls"
expect_block "Shell" '{"command":"tree ."}' "tree command"
expect_block "Shell" '{"command":"git log"}' "unbounded git log"
expect_allow "Shell" '{"command":"git log -n 20"}' "bounded git log"
expect_block "Shell" '{"command":"grep -r error ."}' "recursive grep without cap"
expect_allow "Shell" '{"command":"grep -r -m 50 error src/"}' "recursive grep with -m cap"
expect_allow "Shell" '{"command":"grep -r foo src/"}' "recursive grep scoped to subdirectory"
expect_block "Shell" '{"command":"rg ."}' "repo-wide rg without cap"
expect_block "Shell" '{"command":"rg error"}' "rg pattern without cap or path"
expect_allow "Shell" '{"command":"rg -m 30 error"}' "rg with -m cap"
expect_allow "Shell" '{"command":"rg error src/"}' "rg scoped to subdirectory"

# WebFetch
expect_block "WebFetch" '{"url":"https://example.com"}' "WebFetch blocked"
expect_block "mcp_web_fetch" '{"url":"https://example.com"}' "mcp_web_fetch blocked"

# Deny log
TESTS=$((TESTS + 1))
if [[ ! -f "$EFFICIENCY_DENY_LOG" ]] || [[ "$(wc -l <"$EFFICIENCY_DENY_LOG")" -lt 1 ]]; then
  echo "FAIL [deny-log]: expected deny-log.jsonl entries after block tests" >&2
  FAILURES=$((FAILURES + 1))
fi

# Malformed JSON should fail open (allow)
TESTS=$((TESTS + 1))
if ! echo 'not json' | bash "$HOOK" >/dev/null 2>/dev/null; then
  echo "FAIL [allow]: malformed JSON (expected exit 0)" >&2
  FAILURES=$((FAILURES + 1))
fi

echo ""
if [[ $FAILURES -gt 0 ]]; then
  echo "enforce-efficient-tools tests failed: $FAILURES of $TESTS failed." >&2
  exit 1
fi

echo "enforce-efficient-tools tests passed ($TESTS cases)."
