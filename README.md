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

This repository is a baseline scaffold. The current entrypoint supports
`--help` and `--version`; provisioning, credential leases, cluster operations,
encrypted artifacts, reconciliation, and backup/restore commands are planned.

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
