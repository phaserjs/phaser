# AGENTS.md Starter Sections

Use this as a section checklist when filling `AGENTS.md` for a target repo. Replace placeholders with real values discovered in Phase 1.

## Project overview

- One paragraph: what the repo does and who uses it.
- Main entry points (e.g. `src/index.ts`, `cmd/server/main.go`).
- Link to deeper docs if they exist.

## Development setup

- Required tools and versions (Node 20, Go 1.22, etc.).
- Install command(s) with exact flags.
- One-time setup steps that are **not** in `environment.json` install.

## Running the application

- Dev server command and URL/port.
- Required env vars (by name).
- How to run background workers or secondary services.

## Testing

- Full test suite command.
- Focused test commands (single file, pattern, watch mode).
- How to run integration/e2e tests if separate.

## Linting and formatting

- Lint and format commands.
- Pre-commit hooks if any.

## Architecture notes

- Directory map (what lives where).
- Layer boundaries (e.g. handlers → services → repositories).
- Patterns to follow and anti-patterns to avoid.

## Cursor Cloud specific instructions

### Environment

- Dashboard secrets needed (by name).
- Env vars that must be set for cloud VMs.

### Services

- External APIs, databases, emulators.
- URLs to whitelist if network-restricted.

### Known gotchas

- Flaky tests, login flows, seed data requirements.
- Commands that look right but fail without extra setup.
