# AGENTS.md

## Project

Build `@eliware/elera-cli` with Node.js 26 or later. Use native ESM.

## Scope and boundaries

Build the Elera CLI for database operations, backups, restores, and metadata.

## Layout

Keep source code in `src/`. Keep launchers in `bin/`. Keep tests in `tests/`.
Keep user guides in `docs/`. Keep specifications in `specs/`.

## Development

Keep each source module under 150 lines. Keep each test module under 300 lines.

## Validation

Run `npm test` for aggregate validation.
Run `npm run lint`, `npm run audit`, `npm run format`, and `npm run format:check` as separate checks.

## Security

Do not expose credentials, secrets, or private data.

## Changes

Keep user guides current when behavior changes.

## Application

Validate configuration before you open connections.
Run focused tests first during development.
Run one test file with `npm test -- tests/path/to/example.test.mjs`.
Run multiple test files with `npm test -- tests/path/to/first.test.mjs tests/path/to/second.test.mjs`.
Prevent repeated full-suite runs during development.
Run the full `npm test` suite for final validation before a commit, milestone, or release.

## CLI

Provide `--help` and `--version`.
Make `--version` report `package.json.version`.

## npm publication

Follow Eliware Operations procedures for release approval.
