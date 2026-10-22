# Release Notes

## 15.0.0 — 2026-10-22

### Added

- Added CI output for the Eliware Test log, coverage summary, and Jest console report.
- Added tests for POSIX materializer paths and isolated configuration environments.

### Changed

- Updated `@eliware/common`, `@eliware/elera-lib`, `@eliware/ssh-client`, and `@eliware/test` to version 15.0.0.
- Set the package version to 15.0.0 and removed `@eliware/snowflake` as a direct dependency.
- Used the Snowflake ID API from `@eliware/common` and added `ws` for WebSocket connections.
- Updated repository rules for Eliware Test v15 and set npm 12 as the minimum validation version.
- Clarified command options and plans. Reduced `AGENTS.md` and `README.md` to required repository guidance.
- Refactored CLI commands, client endpoints, parser code, backup and restore code, and related tests.

### Fixed

- Fixed CLI command routing, argument requirements, and target endpoint handling.
- Sent WebSocket credentials in the authorization header.
- Made backup verification check each application database, checksum, and gzip file.
- Made backup creation stop when a child process fails.
- Made dry runs return local plans for initialization, configuration, metadata, and migration provisioning.
- Made migration diagnostics read the supplied configuration file.
- Made node shutdown request supervisor shutdown and wait for the stopped state.
- Made configuration apply, initialization apply, and metadata reconcile return failure for negative or incomplete responses.
- Preserved exact confirmation phrases for node data commands and corrected the routing resync documentation.
