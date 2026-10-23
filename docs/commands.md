# Commands

## Help and options

Run `elera-cli --help` to list command groups. Add `--help` after a group or action to show its arguments and options.

Use these options when the action supports them:

| Option              | Value                                          | Purpose                                                                         |
| ------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------- |
| `--help`            | None                                           | Show the available groups, actions, arguments, and options.                     |
| `--json`            | None                                           | Return the result as JSON.                                                      |
| `--confirm`         | None, or an exact phrase for node data actions | Confirm an action that requires confirmation.                                   |
| `--dry-run`         | None                                           | Return a local plan for supported actions. This option does not run the action. |
| `--once`            | None                                           | Stop a supported live update command after one update.                          |
| `--operation-id`    | Operation ID                                   | Set an operation ID for a supported supervisor call.                            |
| `--target`          | Host name                                      | Direct a supported cluster action to a host.                                    |
| `--target-endpoint` | URL                                            | Set the full target URL for a supported directed action.                        |
| `--quiet`           | None                                           | Accepted by the parser. This option does not change output.                     |
| `--verbose`         | None                                           | Accepted by the parser. This option does not change output.                     |

Use `--confirm` only after you check the action and its target. Use `--confirm="RESET NODE"` for `node reset-data`. Replace `NODE` with the exact node name.

Use `--confirm="RESYNC NODE"` for `node resync`. Replace `NODE` with the exact node name.

Use `--target` or `--target-endpoint` only with an action that supports directed work. The supervisor checks the request and access rules.

The CLI accepts `--grants` with `identity create` and `--scopes` with `token create`. Separate values with commas.

The CLI accepts `--action` with `cluster plan`. It accepts `--value` with metadata reconcile actions. Pass a JSON value to `--value`.

## Native SQL tools

Use `elera-cli sql` to run the native `mysql` command. Use `elera-cli dump` to run the native `mysqldump` command.

The CLI requests a routing bundle with the API token. The bundle supplies the selected writer, port, username, and MariaDB password. The CLI passes command arguments and standard streams to the native client.

```sh
elera-cli sql -e "SHOW DATABASES;"
elera-cli dump app_db > app_db.sql
elera-cli sql app_db < app_db.sql
elera-cli dump --all-databases > full.sql
elera-cli sql < full.sql
```

Use the root token to access every database. Use an app-admin token to access databases in its application. Use a scoped token to access databases allowed by its MariaDB grants.

## Command groups

| Group            | Actions                                                                                                                                                                     | Purpose                                           |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `health`         | `status`, `ready`                                                                                                                                                           | Check supervisor health and readiness.            |
| `initialization` | `status`, `plan`, `apply`, `verify`, `standalone`                                                                                                                           | Check or initialize supervisor metadata.          |
| `telemetry`      | `summary`, `detail APP`, `connections APP`, `watch`                                                                                                                         | Read telemetry or monitor updates.                |
| `recovery`       | `status`, `events`, `acknowledge`, `abort`, `evidence`, `plan`, `authorize JSON`, `bootstrap JSON`, `complete JSON`, `apply`                                                | Inspect or run the supervisor recovery flow.      |
| `cluster`        | `status`, `observations`, `evidence`, `quorum`, `plan ACTION`, `bootstrap`, `join`, `leave`, `rejoin`, `recover`, `startup-status`                                          | Read cluster state or request a lifecycle action. |
| `routing`        | `status`, `routes`, `bundle`, `bundle-version`, `validate`, `events`, `rebalance`, `watch`, `drain`, `drain-status`, `undrain`                                              | Read or change routing and traffic state.         |
| `lifecycle`      | `status`, `node-status`, `drain`, `drain-status`, `undrain`, `stop`, `shutdown-status`                                                                                      | Read or change node lifecycle state.              |
| `configuration`  | `inspect`, `plan`, `apply`, `verify`                                                                                                                                        | Inspect or apply supervisor configuration.        |
| `metadata`       | `status`, `initialize`, `verify`, `reconcile-plan JSON`, `reconcile-apply JSON`, `reconcile-verify JSON`                                                                    | Read or change supervisor metadata.               |
| `database`       | `list`, `create APP DATABASE`, `delete DATABASE_ID`, `plan JSON`, `verify JSON`                                                                                             | Read or change databases.                         |
| `identity`       | `list`, `create APP DATABASE IDENTITY`, `rotate IDENTITY`                                                                                                                   | Read or change runtime identities.                |
| `account`        | `list`, `create USER DATABASE`, `revoke USER`, `verify USER`                                                                                                                | Read or change database accounts.                 |
| `token`          | `list`, `create NAME APP IDENTITY`, `revoke TOKEN`, `rotate NAME`                                                                                                           | Read or change access tokens.                     |
| `app`            | `status APP`, `create APP`                                                                                                                                                  | Read or create an application.                    |
| `app-admin`      | `create APP [TOKEN_NAME]`                                                                                                                                                   | Create an app-admin token.                        |
| `migrate`        | `explain`, `inspect JSON`, `database APP DATABASE`, `identity APP DATABASE IDENTITY`, `token NAME APP IDENTITY`, `verify JSON`                                              | Map legacy data to supervisor operations.         |
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

Use `--dry-run` to get a local plan for a supported action. Check the action with `--help` before you run it.

When you run an action, the supervisor checks the request and makes the final access decision.

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
