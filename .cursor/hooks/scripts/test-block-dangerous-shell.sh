#!/usr/bin/env bash
# Allow/block matrix tests for block-dangerous-shell.sh
#
# Usage: ./hooks/scripts/test-block-dangerous-shell.sh

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
HOOK="$ROOT/hooks/scripts/block-dangerous-shell.sh"

FAILURES=0
TESTS=0

make_input() {
  python3 -c "import json,sys; print(json.dumps({'command': sys.argv[1]}))" "$1"
}

run_hook() {
  make_input "$1" | bash "$HOOK" 2>/dev/null || true
}

hook_exit_code() {
  local exit_code=0
  make_input "$1" | bash "$HOOK" >/dev/null 2>/dev/null || exit_code=$?
  echo "$exit_code"
}

expect_block() {
  local cmd="$1"
  local desc="${2:-$cmd}"
  TESTS=$((TESTS + 1))
  local exit_code
  exit_code=$(hook_exit_code "$cmd")
  if [[ "$exit_code" -ne 2 ]]; then
    echo "FAIL [block]: $desc (exit $exit_code, expected 2)" >&2
    FAILURES=$((FAILURES + 1))
    return
  fi

  local output
  output=$(run_hook "$cmd")
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
  local cmd="$1"
  local desc="${2:-$cmd}"
  TESTS=$((TESTS + 1))
  local exit_code
  exit_code=$(hook_exit_code "$cmd")
  if [[ "$exit_code" -ne 0 ]]; then
    echo "FAIL [allow]: $desc (exit $exit_code, expected 0)" >&2
    FAILURES=$((FAILURES + 1))
    return
  fi

  local output
  output=$(run_hook "$cmd")
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

echo "Running block-dangerous-shell.sh tests..."

# Empty / malformed input
expect_allow "" "empty command"
expect_allow "ls -la" "normal safe command"

# rm -rf / and variants
expect_block "rm -rf /" "rm -rf root"
expect_block "rm  -rf  /" "rm -rf root with extra spaces"
expect_allow "rm -rf /tmp/build" "rm -rf under root path"
expect_allow "rm -rf /workspace/tmp/foo" "rm -rf absolute workspace path"
expect_block "rm -rf /;" "rm -rf root with trailing semicolon"
expect_block "rm -rf ~" "rm -rf home"
expect_block "rm -rf ~/projects" "rm -rf home subdirectory"
expect_allow "rm -rf ./build" "rm -rf relative path"
expect_allow "rm -rf build" "rm -rf local directory name"
expect_allow "rm -rf ." "rm -rf current directory"

# Long-form flags are not matched today (documents current behavior)
expect_allow "rm --recursive --force /" "rm long flags to root (known gap)"
expect_allow "rm -fr /" "rm -fr flag order (known gap)"

# git force push to protected branches
expect_block "git push --force origin main" "git push --force main"
expect_block "git push -f origin main" "git push -f origin main"
expect_block "git push -f master" "git push -f master"
expect_block "git push -f origin master" "git push -f origin master"
expect_block "git push origin +main" "git push refspec force +main"
expect_block "git push origin +master" "git push refspec force +master"
expect_block "git push +main" "git push refspec force +main without remote"
expect_block "git push origin HEAD:main" "git push HEAD:main"
expect_block "git push origin HEAD:master" "git push HEAD:master"
expect_block "git push origin feature:main" "git push refspec targeting main"
expect_block "git push origin feature:master" "git push refspec targeting master"
expect_allow "git push origin main" "git push without force"
expect_allow "git push -f feature-branch" "git push -f feature branch"
expect_allow "git push --force origin feature-branch" "git push --force feature branch"
expect_allow "git push -f main-backup" "git push -f main-backup branch"
expect_allow "git push --force origin main-backup" "git push --force main-backup branch"
expect_allow "git push origin +main-backup" "git push refspec force main-backup branch"
expect_allow "git push origin HEAD:main-backup" "git push HEAD:main-backup branch"
expect_allow "git push origin feature:main-backup" "git push refspec targeting main-backup branch"

# Destructive disk operations
expect_block "dd if=/dev/zero of=/dev/sda" "dd with if="
expect_block "mkfs.ext4 /dev/sda1" "mkfs.ext4"
expect_block "mkfs.xfs /dev/sda" "mkfs.xfs"
expect_allow "mkfs /dev/sda" "bare mkfs without filesystem type (known gap)"

# Fork bomb
expect_block ':(){ :|:& };:' "fork bomb"

# Command chaining: dangerous segment anywhere in the string
expect_block "ls -la && rm -rf /" "chained command with rm -rf /"
expect_block "git status; git push -f main" "chained git force push"

# Anchored rm -rf / pattern does not match quoted substrings in other commands
expect_allow "grep -r 'rm -rf /' docs/" "grep pattern containing rm -rf / (not root deletion)"

# Malformed JSON should fail open (allow)
TESTS=$((TESTS + 1))
if ! echo 'not json' | bash "$HOOK" >/dev/null 2>/dev/null; then
  echo "FAIL [allow]: malformed JSON (expected exit 0)" >&2
  FAILURES=$((FAILURES + 1))
else
  malformed_output=$(echo 'not json' | bash "$HOOK" 2>/dev/null)
  if ! python3 -c "
import json, sys
data = json.loads(sys.argv[1])
assert data.get('permission') == 'allow', data
" "$malformed_output" 2>/dev/null; then
    echo "FAIL [allow-json]: malformed JSON (invalid allow JSON: $malformed_output)" >&2
    FAILURES=$((FAILURES + 1))
  fi
fi

echo ""
if [[ $FAILURES -gt 0 ]]; then
  echo "block-dangerous-shell tests failed: $FAILURES of $TESTS failed." >&2
  exit 1
fi

echo "block-dangerous-shell tests passed ($TESTS cases)."
