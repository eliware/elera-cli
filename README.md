# @eliware/elera-cli

Agent-friendly Elera database operations CLI. The package consumes
`@eliware/elera-lib` for shared contracts and validation.

The CLI will authenticate to the supervisor API with a scoped bearer token and
use its supervisor API client for SQL metadata operations. Large backup and restore
streams will continue to use native `mariadb-dump` and `mariadb` subprocesses;
they will not pass through the supervisor API as JSON.

The supervisor REST API remains the CLI's primary control interface. Application
WebSocket routing and native MariaDB connections belong to
`@eliware/elera-client`; the CLI uses its own administrative API and native
subprocess paths. The CLI does not own application connection pools.

## Command model

Commands use a family/action hierarchy. Use `elera-cli --help` for families,
`elera-cli cluster --help` for family actions, and
`elera-cli cluster join --help` for command-specific usage and options.

Examples:

```text
elera-cli health status
elera-cli cluster status --json
elera-cli routing bundle --target node-1
elera-cli telemetry detail app-name
elera-cli cluster bootstrap --confirm --operation-id bootstrap-1
```

The load-balancer endpoint is the default for ordinary API operations. Commands
that affect a specific node require an explicit direct target. Bootstrap,
recovery, drain, restore, and credential-destructive operations require
`--confirm`; `--dry-run` plans without changing state.

## Current status

The CLI currently supports health and readiness checks, supervisor status and
routing inspection, metadata and cluster lifecycle operations, managed
database/identity/account/token commands, reconciliation, and native-stream
backup/restore verification. Metadata-first artifact restore reads the local
`SUPERVISOR-METADATA.json` sidecar, restores metadata and logical accounts
through the supervisor API, and streams application SQL with native MariaDB
commands.

Encrypted artifact commands are available for listing, retrieval of ciphertext,
verification, replacement, and deletion. `AGE_RECIPIENT` configures native age
encryption for `secret-put`; `AGE_IDENTITY_FILE` is used only for local
decryption by library workflows. Neither key is sent to the supervisor or
persisted by the CLI.

`secrets materialize <name> <command> [args...]` decrypts an artifact into a
mode-restricted temporary file, appends that path to the child command, and
removes the temporary directory when the command exits. It never writes
plaintext to CLI output.

SSH, `known_hosts`, TLS, and backup inputs are resolved from GitOps/operator
mounts using `ELERA_SSH_KEY_PATH`, `ELERA_KNOWN_HOSTS_PATH`,
`ELERA_TLS_CERTIFICATE_PATH`, and `ELERA_BACKUP_CONFIG_PATH`. The CLI validates
paths but does not log or copy their contents.

## Configuration and operations

Set `ELERA_API_ENDPOINT` and the administrative `ELERA_CLI_TOKEN` in the
project-root `.env`; `ELERA_API_TOKEN` is reserved for application runtime
clients. Explicit environment values take precedence. Do not place passwords,
raw tokens, private keys, SQL dumps, or decrypted artifacts in the repository.

The CLI is a short-lived command process. It validates configuration before
opening supervisor or database connections, inherits standard input/output for
SQL and dump pipelines, and returns the child MariaDB exit code for passthrough
failures. Health and readiness are exposed through `health status` and
`health ready`; platform lifecycle, backup, and restore commands require the
documented confirmation gates and emit operation diagnostics without secret
values.

Backups use the native MariaDB tools plus Elera metadata artifacts. Verify a
backup before restore, keep the original artifact unchanged, and use the
restore verification commands after completion. If restore or deployment
validation fails, stop and preserve the last known-good backup; application
image rollback does not reverse database changes.

## Development

```bash
npm ci
npm test
npm run lint
npm run check
npm run contracts
npm run audit
npm run pack
```

During pre-release development, this checkout may intentionally consume
`@eliware/elera-lib` through the local workspace reference in `package.json`.
That link is for coordinated local validation only; replace it with the
published semver dependency before packaging a release.

Do not commit API tokens, age keys, database passwords, dumps, or decrypted
artifacts.
Metadata initialization is explicit and requires `elera-cli metadata initialize
--confirm`; status and verification use `metadata status` and `metadata verify`.
Disposable node recovery uses `elera-cli node resync <node> --confirm="RESYNC
<node>"`; the supervisor enforces node identity, liveness, and data-disposition
safety. The CLI never deletes node data locally.
