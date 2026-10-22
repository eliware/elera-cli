import { dispatchReadOnly } from "./read-only.mjs";
import { dispatchManagement } from "./management.mjs";
import { createReadOnlyHandlers } from "../handlers/read/only.mjs";
import { createManagementHandlers } from "../handlers/management.mjs";
import { runBackupRestoreCommand } from "../handlers/backup/restore.mjs";
import { runPrimarySqlSmoke } from "../handlers/primary/smoke.mjs";
import { runPrimaryMigrationDiagnostics } from "../handlers/primary/diagnostics.mjs";

export async function dispatchPrimaryCommands(input) {
  const {
    command,
    client,
    controlClient,
    emit,
    args,
    config,
    dependencies,
    environment,
    argv,
    parsed,
    operationId,
  } = input;
  if (command === "sql-smoke") return runPrimarySqlSmoke({ client, emit, config, dependencies });
  const backupResult = await runBackupRestoreCommand({
    command,
    client,
    emit,
    args,
    config,
    dependencies,
    environment,
  });
  if (backupResult !== undefined) return backupResult;
  if (command === "migration-check" || command === "preflight")
    return runPrimaryMigrationDiagnostics({ dependencies, argv, config, emit });
  const readOnlyResult = await dispatchReadOnly({
    command,
    client,
    emit,
    application: argv[1],
    identity: config.identity,
    handlers: createReadOnlyHandlers({ config, argv }),
  });
  if (readOnlyResult !== undefined) return readOnlyResult;
  return dispatchManagement({
    command,
    client,
    controlClient,
    emit,
    args,
    options: {
      ...parsed.options,
      confirm: argv.includes("--confirm"),
      "dry-run": argv.includes("--dry-run"),
    },
    operationId,
    handlers: createManagementHandlers(),
  });
}
