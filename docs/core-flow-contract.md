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

All command requests and responses must preserve the shared resource IDs,
token binding, scope, routing-bundle, and authorization semantics.

The CLI consumes `@eliware/elera-lib` only for shared contracts and validation;
administration, SQL passthrough, backup, restore, and recovery workflows remain
CLI-owned.
