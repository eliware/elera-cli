# Configuration

## Required values

Set `ELERA_API_ENDPOINT` to the HTTP or HTTPS URL of the supervisor. The default example is `http://localhost:8080`.

Set `ELERA_CLI_TOKEN` to the administrative token for this CLI. Do not use `ELERA_API_TOKEN`. Application runtime clients use that name.

## Optional values

| Name                 | Purpose                              | Default                                         |
| -------------------- | ------------------------------------ | ----------------------------------------------- |
| `ELERA_API_PROTOCOL` | Protocol for a directed host target. | The protocol in `ELERA_API_ENDPOINT`.           |
| `ELERA_API_PORT`     | Port for a directed host target.     | The URL port, or 443 for HTTPS, or 80 for HTTP. |
| `ELERA_DATABASE`     | Default database context.            | None.                                           |
| `ELERA_IDENTITY`     | Default identity context.            | None.                                           |
| `AGE_RECIPIENT`      | Recipient for encrypted secrets.     | None.                                           |
| `AGE_IDENTITY_FILE`  | Identity file for secret reads.      | None.                                           |

Some commands require database and identity context. Set both values for those commands.

## Set values

The CLI reads `.env` from its current working directory. Copy `.env.example` to `.env` in that directory.

Set one value on each line. Use `NAME=value` format. Use quotes around a value when it contains spaces.

The CLI uses process environment values before `.env` values. Keep real token values out of Git.

```dotenv
ELERA_API_ENDPOINT=https://supervisor.example
ELERA_API_PROTOCOL=https
ELERA_API_PORT=443
ELERA_CLI_TOKEN=replace-with-your-token
ELERA_DATABASE=payments
ELERA_IDENTITY=payments-runtime
AGE_RECIPIENT=age1example
```

Use a hostname that resolves from the machine that runs the CLI. Use a port that accepts supervisor API requests.

## Direct a request

Use `--target HOST` for a cluster command that accepts a host target. The CLI builds the endpoint from the configured protocol and port.

Use `--target-endpoint URL` when the target needs a full URL. Do not add credentials to the URL.

Use `--operation-id ID` to pass an operation ID to supported supervisor calls. The supervisor remains the source of access decisions.
