# Release Notes

## 12.0.0 — 2026-10-15

### Added

- Recorded the CLI changes in this repository. No earlier repository tag exists.
- Added command groups for health, initialization, telemetry, recovery, cluster, routing, lifecycle, configuration, metadata, databases, identities, accounts, tokens, applications, migration, secrets, backup, restore, diagnostics, and SQL checks.
- Added command help, JSON output, operation IDs, target selection, confirmation checks, and dry-run plans.
- Added exit codes for invalid input, access failure, network failure, unsafe state, non-primary cluster state, and escalated work.
- Added application and app-admin provisioning commands.
- Added migration guidance that maps legacy work to supervisor operations.

- Added a supervisor API client that uses `@eliware/elera-lib` for shared bundle validation.
- Added target and control endpoint routing for application, platform, and recovery actions.
- Added cluster status, lifecycle, quorum, recovery, and node reset operations.
- Added operation polling and terminal status handling.
- Added HTTP migration checks for service probes and legacy configuration.

- Added compressed SQL dump and restore commands.
- Added backup creation, listing, checksum checks, gzip checks, and retention rotation.
- Added restore plans and verification for database, metadata, and account data.
- Added artifact restore for metadata, accounts, encrypted secrets, and application SQL.
- Kept database passwords out of command arguments. The CLI passes them to child processes through `MYSQL_PWD`.

- Added encrypted secret list, get, put, verify, and delete commands.
- Added age encryption for secret writes.
- Added temporary secret materialization for one child command.
- Added resolution for mounted GitOps input files.

- Set the package to Node.js 26 or later with native ESM.
- Added public package metadata, a CLI executable, package documentation, and release files.
- Added repository checks for tests, lint, format, package audit, and package contents.
- Added GitHub validation and npm publication workflows.
