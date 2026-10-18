# Backup and restore

## Create a backup

Set `ELERA_DATABASE` and `ELERA_IDENTITY`, or pass a database list to `backup create`. Give the command a backup root path.

```sh
elera-cli backup create ./backup --json
```

The CLI asks the supervisor for a routing bundle and metadata. It writes compressed SQL files, a `DATABASES` list, a `SHA256SUMS` file, and supervisor metadata.

Pass comma-separated database names after the backup path to select databases:

```sh
elera-cli backup create ./backup app_db,report_db --json
```

The CLI excludes system databases. It records metadata and accounts with the backup.

## Check a backup

List backup directories:

```sh
elera-cli backup list ./backup-root --json
```

Verify compressed files and checksums:

```sh
elera-cli backup verify ./backup/20261015 --json
```

Use the exact path that the create command returns. Keep the full backup set together.

## Dump or restore one database

Create a SQL dump:

```sh
elera-cli backup dump ./payments.sql.gz --json
```

Apply a SQL file to the selected database:

```sh
elera-cli restore apply ./payments.sql.gz --json
```

The restore command changes database contents. Check the selected database and file before you run it. Create and verify a backup first.

## Restore a backup set

Verify the backup set before you restore it. Use a supervisor token with access to the target database.

```sh
elera-cli restore verify ./backup/20261015 --json
```

Apply a full artifact backup with explicit confirmation:

```sh
elera-cli restore artifact ./backup/20261015 --confirm --json
```

Artifact restore applies supervisor metadata and accounts before it restores application SQL. It can also write encrypted secrets to the supervisor.

## Restore metadata or accounts

Pass a JSON value to the plan command first:

```sh
elera-cli restore metadata-plan '{"databases":[],"identities":[]}' --json
```

Apply metadata only after you check the plan:

```sh
elera-cli restore metadata-apply '{"databases":[],"identities":[]}' --json
```

Use `restore accounts-plan`, `restore accounts-apply`, and `restore accounts-verify` with a JSON array of account records.

## Backup files

Keep `DATABASES`, `SHA256SUMS`, `SUPERVISOR-METADATA.json`, and every listed `.sql.gz` file in one directory. Do not edit the checksum file.

Store backups outside Git. Keep backup files safe. Read the [token guide](security.md) before you move backup files.
