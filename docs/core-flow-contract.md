# Core-flow contract

The CLI follows the shared Elera core flow. It must use the published
supervisor API and must not require applications or app owners to know physical
SQL names, credentials, node addresses, or cluster settings.

## Configuration

The project-root CLI configuration uses `ELERA_API_ENDPOINT` and
`ELERA_CLI_TOKEN` by default. `ELERA_API_TOKEN` remains the application
runtime token and is not used for administrative CLI commands.

Project owners keep these values in the `.env` file at their project root;
the CLI loads it automatically for direct, installed, and symlinked use.
`ELERA_CLI_TOKEN` is intentionally separate from application runtime tokens.

## Provisioning model

Root administrators create an application and its app-admin token. App-admin
users then manage only that application. Databases and identities use friendly
names; the supervisor assigns Snowflake IDs and generated physical names.

Runtime tokens resolve directly to one application, one database, one identity,
and scopes. Separate databases require separate runtime tokens.

## Command boundary

Application onboarding and resource management belong under the app/app-admin,
database, identity, and token command families. Cluster initialization,
bootstrap, recovery, node lifecycle, drain, secrets, and platform backup or
restore remain root-only operations.

Metadata initialization is also a supervisor control-plane operation. The CLI
dispatches it through the authenticated `controlClient` for the selected
supervisor endpoint; it does not open a host-local SQL socket or provide a
local-socket fallback for remote or containerized supervisors.

All command requests and responses must preserve the shared resource IDs,
token binding, scope, routing-bundle, and authorization semantics.

Supervisor responses are passed through without flattening the shared envelope:
`apiVersion`, `ok`, `requestId`, `operation`, `operationId`, `status`,
`changed`, and `data` remain available to callers. Failed responses retain the
supervisor error shape and are never replayed automatically. Long-running
operations can be polled through the documented operation endpoint with a
bounded timeout; terminal states include `completed`, `failed`, `error`, and
`cancelled`.

Migration is a CLI workflow over existing supervisor operations: `database`,
`identity`, and `token` map to provisioning APIs, while `inspect` and `verify`
map to reconcile plan and verify. Migration-specific response schemas remain
pending until the supervisor publishes them. Friendly-name resolution is only
used where a public supervisor lookup exists; application status and database
delete require stable IDs at the API boundary.

The CLI consumes `@eliware/elera-lib` only for shared contracts and validation;
administration, SQL passthrough, backup, restore, and recovery workflows remain
CLI-owned.
