# Commands

## Help and options

Run `elera-cli --help` to list command groups. Add `--help` after a group or action to show its arguments and options.

Use `--json` for JSON output. Use `--once` for a live update command that must stop after one update.

Use `--confirm` only after you check a command that changes data or supervisor state. Use `--dry-run` when the command supports a plan.

Use `--operation-id ID` to set the operation ID for supported calls. Use `--target HOST` or `--target-endpoint URL` for directed cluster work.

The parser accepts `--quiet` and `--verbose`, but these flags do not change output at this time.

## Command groups

| Group            | Actions                                                                                                                                                                     | Purpose                                           |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `health`         | `status`, `ready`                                                                                                                                                           | Check supervisor health and readiness.            |
| `initialization` | `status`, `plan`, `apply`, `verify`, `standalone`                                                                                                                           | Check or initialize supervisor metadata.          |
| `telemetry`      | `summary`, `detail APP`, `connections APP`, `watch`                                                                                                                         | Read telemetry or monitor updates.                |
| `recovery`       | `status`, `events`, `acknowledge`, `abort`, `evidence`, `plan`, `authorize JSON`, `bootstrap JSON`, `complete JSON`, `apply`                                                | Inspect or run the supervisor recovery flow.      |
| `cluster`        | `status`, `observations`, `evidence`, `quorum`, `plan ACTION`, `bootstrap`, `join`, `leave`, `rejoin`, `recover`, `startup-status`                                          | Read cluster state or request a lifecycle action. |
| `routing`        | `status`, `routes`, `bundle`, `bundle-version`, `validate`, `events`, `rebalance`, `watch`, `resync NODE`, `drain`, `drain-status`, `undrain`                               | Read or change routing and traffic state.         |
| `lifecycle`      | `status`, `node-status`, `drain`, `drain-status`, `undrain`, `stop`, `shutdown-status`                                                                                      | Read or change node lifecycle state.              |
| `configuration`  | `inspect`, `plan`, `apply`, `verify`                                                                                                                                        | Inspect or apply supervisor configuration.        |
| `metadata`       | `status`, `initialize`, `verify`, `reconcile-plan JSON`, `reconcile-apply JSON`, `reconcile-verify JSON`                                                                    | Read or change supervisor metadata.               |
| `database`       | `list`, `create APP DATABASE`, `delete DATABASE_ID`, `plan JSON`, `verify JSON`                                                                                             | Read or change databases.                         |
| `identity`       | `list`, `create APP DATABASE IDENTITY`, `rotate IDENTITY`                                                                                                                   | Read or change runtime identities.                |
| `account`        | `list`, `create USER DATABASE`, `revoke USER`, `verify USER`                                                                                                                | Read or change database accounts.                 |
| `token`          | `list`, `create NAME APP IDENTITY`, `revoke TOKEN`, `rotate NAME`                                                                                                           | Read or change access tokens.                     |
| `app`            | `status APP`, `create APP`                                                                                                                                                  | Read or create an application.                    |
| `app-admin`      | `create APP [TOKEN_NAME]`                                                                                                                                                   | Create an app-admin token.                        |
| `migrate`        | `explain`, `inspect`, `database`, `identity`, `token`, `verify`                                                                                                             | Map legacy data to supervisor operations.         |
| `credentials`    | `list`, `create`, `revoke`, `rotate`                                                                                                                                        | Alias account and token commands.                 |
| `node`           | `status`, `drain`, `drain-status`, `undrain`, `shutdown`, `recover`, `reset-data NODE`, `resync NODE`                                                                       | Read or change node state.                        |
| `secrets`        | `list`, `get NAME`, `put NAME FILE`, `verify NAME`, `delete NAME`, `materialize NAME COMMAND [ARGS...]`                                                                     | Read or change encrypted secrets.                 |
| `backup`         | `create PATH`, `dump FILE`, `verify PATH`, `list PATH`, `plan JSON`                                                                                                         | Create, inspect, or verify backups.               |
| `restore`        | `plan JSON`, `apply FILE`, `verify PATH`, `artifact PATH`, `metadata-plan JSON`, `metadata-apply JSON`, `accounts-plan JSON`, `accounts-apply JSON`, `accounts-verify JSON` | Plan or run a restore.                            |
| `diagnostics`    | `migration`, `inspect`                                                                                                                                                      | Check migration state or configuration.           |
| `smoke`          | `sql`                                                                                                                                                                       | Run a `SELECT 1` database check.                  |

`APP`, `DATABASE`, `IDENTITY`, `USER`, `TOKEN`, `PATH`, `FILE`, and `JSON` mark values that you must supply. Use exact names from the supervisor.

## Default values

`account create` uses host `%` and grant `SELECT`. `identity create` uses purpose `runtime` and grant `SELECT`.

`token create` uses scope `credential:issue`. `backup create` uses `ELERA_DATABASE` when you omit a database list.

Use `--grants VALUE` with `identity create`. Separate grant names with commas. Use `--scopes VALUE` with `token create`.

## Confirmation

Use `--confirm` for cluster setup, join, exit, rejoin, metadata setup, standalone setup, token changes, acknowledge, abort, and routing rebalance.

Use `--confirm` for database deletion and cold recovery actions.

Use `--dry-run` for a plan when the command supports it. The CLI sends the final request to the supervisor. The supervisor makes the final access decision.

For node data removal, set `--confirm="RESET NODE"`. Replace `NODE` with the exact node name. For node resync, set `--confirm="RESYNC NODE"`.

Read [Backup and restore](backup-restore.md) before you run a restore. Restore commands can replace database or supervisor data.

## Common tasks

Check application status:

```sh
elera-cli app status payments --json
```

Plan a database change:

```sh
elera-cli database plan '{"name":"ledger"}' --json
```

Inspect cluster state:

```sh
elera-cli cluster status --json
```

Read [Usage](usage.md) to install the CLI. Read [Configuration](configuration.md) to set access values.
