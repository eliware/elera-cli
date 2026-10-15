# Security

## Tokens

Use a CLI token that matches the task. Ask an administrator for the correct token and scope.

Store the token in the process environment or a local `.env` file. Keep `.env` out of Git. The repository ignores `.env` files.

Do not paste tokens into command arguments, issue text, logs, or support messages. Use `ELERA_CLI_TOKEN` for this CLI. Do not use the application runtime variable `ELERA_API_TOKEN`.

## Database access

The CLI sends API requests to the configured supervisor. The supervisor checks each request and applies its access rules.

The CLI leases database credentials for SQL dump and restore commands. It gives the password to the child process through `MYSQL_PWD`. The password does not appear in the command arguments.

Read [Access model](access-model.md) before you use root or app-admin commands.

## Secret files

The `secrets put` command reads a local file and encrypts its contents with `age`. Give the CLI an age recipient through its process environment.

The `secrets materialize` command writes a decrypted secret to a temporary path for one command. The CLI removes the temporary directory after the command ends.

Keep age identities and recipients out of Git. Use GitOps input paths for mounted files. Do not copy secret contents into logs.

## Backups

Treat SQL dumps and backup sets as sensitive data. Store them outside the repository. Limit access to the users who need them.

Check target names and paths before restore. Read [Backup and restore](backup-restore.md) before you change data.

## Logs and reports

Use `--json` when a script needs structured output. Review output before you share it. Remove tokens, passwords, private data, and secret values.
