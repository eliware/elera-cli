# AGENTS.md

## Project

Build `@eliware/elera-cli` with Node.js 26 or later and native ESM.

## Scope and boundaries

Build a CLI for Elera database operations, backup, restore, and metadata.
Do not treat validation as release approval.

## Layout

Keep source code in `src/`. Keep launchers in `bin/`. Keep tests in `tests/`.
Keep user documentation in `docs/`. Keep specifications in `specs/`.

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

Keep docs current. Follow the shared repository rules.

## Application

Keep application code in `src/`. Keep launchers in `bin/`.
Keep application settings out of source files.

## CLI

Provide `--help` and `--version`.
Make `--version` report `package.json.version`.

## npm publication

Set `private` to `false`. Set `publishConfig.provenance` to `true`.
Run `npm run pack` before publication review.
