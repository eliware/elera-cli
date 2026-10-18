# Troubleshooting

## Check the installation

Check the package version:

```sh
elera-cli --version
```

Check the available command groups:

```sh
elera-cli --help
```

Install Node.js 26 or later if the CLI does not start. Install the package again if the executable is missing.

## Check configuration

Check `ELERA_API_ENDPOINT` and `ELERA_CLI_TOKEN`. Check `ELERA_DATABASE` and `ELERA_IDENTITY` when the command requires resource context.

Run a health check:

```sh
elera-cli health status --json
```

Check that the endpoint uses HTTP or HTTPS. Check that the supervisor accepts requests from the CLI host.

The CLI reads `.env` from its current working directory. Check that the file is in that directory. The CLI uses process values before file values.

## Read exit codes

| Code | Meaning                                                       | Action                                                   |
| ---- | ------------------------------------------------------------- | -------------------------------------------------------- |
| `0`  | The command completed.                                        | Check the result.                                        |
| `1`  | The operation did not complete or returned a negative result. | Read the output and check the supervisor state.          |
| `2`  | The command, option, or input is invalid.                     | Run help and correct the input.                          |
| `3`  | The token lacks access or has expired.                        | Ask an administrator to check the token.                 |
| `4`  | The CLI could not complete a network request.                 | Check the endpoint and network path.                     |
| `5`  | The supervisor reports an unsafe operation.                   | Read the cause. Do not retry until you resolve it.       |
| `6`  | The cluster is not in a primary state.                        | Ask the cluster administrator to check cluster health.   |
| `7`  | The operation was forced or escalated.                        | Ask the supervisor administrator to check the operation. |

## Correct common errors

For `requires --confirm`, read the action plan and pass the required confirmation. Do not add confirmation before you check the action.

For a missing positional value, run help for that action. Supply the required application, database, identity, path, or JSON value.

For a bundle validation error, check the supervisor response and shared contract version. Do not change bundle fields to bypass validation.

For a backup checksum or gzip error, create a new backup. Keep every backup file together. Do not edit `SHA256SUMS`.

For an age error, set the required recipient or identity path. Check the age executable and key permissions.

## Report an issue

Run `elera-cli ACTION --help` to confirm the command syntax. Include the command name, exit code, Node.js version, and a redacted error message.

Remove tokens, passwords, private host names, database contents, and secret data before you share a report.
