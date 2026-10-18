# AGENTS.md

## Project

Build `@eliware/elera-cli` with Node.js 26 or later. Use native ESM.

## Scope and boundaries

Build a CLI for Elera database operations, backups, restores, and metadata.
Do not use validation as release approval.

## Layout

Keep source code in `src/`. Keep launchers in `bin/`. Keep tests in `tests/`.
Keep user guides in `docs/`. Keep specifications in `specs/`.

## Development

Keep each source module under 100 lines. Keep each test module under 200 lines.

## Validation

Run `npm test` for all checks.
Run `npm run lint` for lint checks.
Run `npm run audit` for package checks.
Run `npm run format` to format files.
Run `npm run format:check` to check file format.
Run `npm run pack` to check package contents.

## Security

Keep credentials, tokens, secrets, and private data out of logs.

## Changes

Keep user guides current. Follow the shared repository rules.

## Application

Keep application code in `src/`. Keep launchers in `bin/`.
Keep application settings out of source files.
Run focused tests first during development.
Run one test file with `npm test -- tests/path/to/example.test.mjs`.
Run multiple test files with `npm test -- tests/path/to/first.test.mjs tests/path/to/second.test.mjs`.

Prevent repeated full-suite runs during development.
Run the full `npm test` suite for final validation before a commit, milestone, or release.

## CLI

Provide `--help` and `--version`.
Make `--version` report `package.json.version`.

## npm publication

Set `private` to `false`. Set `publishConfig.provenance` to `true`.
Run `npm run pack` before publication inspection.
