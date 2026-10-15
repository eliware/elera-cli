# AGENTS.md

## Project

Build @eliware/elera-cli with Node.js 26 or later and native ESM.

## Scope and boundaries

Agent-friendly CLI for Elera database operations, backup, restore, and metadata management.
Do not publish or deploy during validation.

## Layout

Keep runtime code in src/, tests in tests/, docs in docs/, and specifications in specs.

## Development

Give each source module one clear purpose. Keep source modules under 100 lines. Keep test modules under 200 lines.

## Validation

Run npm test for aggregate validation.
Run npm run lint for lint checks.
Run npm run audit for package audit checks.
Run npm run format to format files.
Run npm run format:check to check file format.
Run npm run pack to check package contents.

## Security

Keep credentials, tokens, secrets, and private data out of logs.

## Changes

Keep docs current. Follow the shared repository rules.

## Application

Keep application code under src/. Keep launchers under bin/. Keep app settings out of source files.

## CLI

Provide --help and --version. Return the package version from --version.

## npm publication

The public package is @eliware/elera-cli. Include the required runtime files and metadata. Run npm run pack before publication review.
