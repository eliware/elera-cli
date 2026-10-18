# Release Notes

## 13.0.0 — 2026-10-18

### Added

- Added commands for health, telemetry, recovery, clusters, routing, lifecycle, configuration, metadata, data, identity, accounts, tokens, apps, migration, secrets, backups, restores, diagnostics, and SQL checks.
- Added command help, JSON output, operation IDs, target selection, confirmation checks, and dry-run plans.
- Added exit codes for invalid input, access failure, network failure, unsafe state, non-primary cluster state, and escalated work.
- Added application and app-admin provisioning commands.
- Added migration guidance that maps legacy work to supervisor operations.
- Added a supervisor API client that uses `@eliware/elera-lib` for shared bundle validation.
- Added target and control endpoint routing for application, platform, and recovery actions.
- Added cluster status, lifecycle, quorum, recovery, and node data clearing operations.
- Added operation polling and terminal status handling.
- Added HTTP migration checks for probes and legacy configuration.
- Added compressed SQL dump and restore commands.
- Added backup creation, listing, checksum checks, gzip checks, and retention limits.
- Added restore plans and checks for database, metadata, and account data.
- Added artifact restore for metadata, accounts, encrypted secrets, and application SQL.
- Kept database passwords out of command arguments. The CLI passes them to child processes through `MYSQL_PWD`.
- Added encrypted secret list, get, put, verify, and delete commands.
- Added age encryption for secret writes.
- Added temporary secret materialization for one child command.
- Added support for mounted GitOps input files.
- Set the package to Node.js 26 or later with native ESM.
- Added public package metadata, a CLI executable, user guides, and release files.
- Added repository checks for tests, lint, format, package audit, and package contents.
- Added GitHub validation and npm publication workflows.
- Set the package version to 13.0.0.
- Aligned the npm publication workflow with the shared workflow.
- Set the deployment checkout path to `/eliware/elera-cli`.
