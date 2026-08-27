# @eliware/galera-cli

Agent-friendly Galera database operations CLI. The package is developed with a
local `file:../galera-lib` dependency until both packages are published.

The CLI will authenticate to the supervisor API with a scoped bearer token and
use `@eliware/galera-lib` for SQL metadata operations. Large backup and restore
streams will continue to use native `mariadb-dump` and `mariadb` subprocesses;
they will not pass through the supervisor API as JSON.

## Current status

This repository is a baseline scaffold. The current entrypoint supports
`--help` and `--version`; provisioning, credential leases, cluster operations,
encrypted artifacts, reconciliation, and backup/restore commands are planned.

## Development

The sibling repository must be available at `../galera-lib` for the local link:

```bash
npm ci
npm test
npm run lint
npm run check
npm run pack
```

Do not commit API tokens, age keys, database passwords, dumps, or decrypted
artifacts.
