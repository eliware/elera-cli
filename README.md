# @eliware/elera-cli

Agent-friendly Elera database operations CLI. The package is developed with a
local `file:../elera-lib` dependency until both packages are published.

The CLI will authenticate to the supervisor API with a scoped bearer token and
use `@eliware/elera-lib` for SQL metadata operations. Large backup and restore
streams will continue to use native `mariadb-dump` and `mariadb` subprocesses;
they will not pass through the supervisor API as JSON.

The supervisor REST API remains the CLI’s primary control interface. The
optional WebSocket routing stream belongs inside `@eliware/elera-lib`: it
delivers versioned routing snapshots and topology events while the library
maintains direct MariaDB connections on port `3306`. If that stream is
unavailable, the library refreshes its bundle through the supervisor REST API.

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

`secret-materialize <name> <command> [args...]` decrypts an artifact into a
mode-restricted temporary file, appends that path to the child command, and
removes the temporary directory when the command exits. It never writes
plaintext to CLI output.

SSH, `known_hosts`, TLS, and backup inputs are resolved from GitOps/operator
mounts using `ELERA_SSH_KEY_PATH`, `ELERA_KNOWN_HOSTS_PATH`,
`ELERA_TLS_CERTIFICATE_PATH`, and `ELERA_BACKUP_CONFIG_PATH`. The CLI validates
paths but does not log or copy their contents.

## Development

The sibling repository must be available at `../elera-lib` for the local link:

```bash
npm ci
npm test
npm run lint
npm run check
npm run pack
```

Do not commit API tokens, age keys, database passwords, dumps, or decrypted
artifacts.
Metadata initialization is explicit and requires `elera-cli metadata-init
--confirm`; status and verification use `metadata-status` and
`metadata-verify`.
