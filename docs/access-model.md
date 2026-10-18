# Access model

## Supervisor access

The supervisor is the source of access decisions and Elera state. The CLI sends requests to the supervisor API.

Use an administrative CLI token for platform work. The supervisor checks the token scope for each request.

## Application access

An administrator creates an application and an app-admin token. The token can manage its assigned application in its scope.

Use friendly application, database, and identity names in CLI commands. The supervisor maps these names to internal IDs and physical database names.

## Runtime access

Use a runtime token for an application connection. A runtime token binds to one application, database, identity, and set of scopes.

Use a separate runtime token for each database. Do not use a runtime token as a CLI administrative token.

## Request routing

Application resource commands use the target supervisor endpoint. Platform and recovery commands use the configured control endpoint.

Use `--target HOST` only when a command directs an action to a cluster host. Use `--target-endpoint URL` when the target needs a full URL.

The CLI does not maintain a separate recovery authority. The supervisor checks quorum and recovery state before it accepts an action.
