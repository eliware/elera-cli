import { createMigrationDiagnostics } from "../../migration/diagnostics.mjs";
import { runMigrationDiagnostics } from "../../commands/diagnostics/migration.mjs";
import { dispatchReadOnly } from "./read-only.mjs";
import { dispatchManagement } from "./management.mjs";
import { createReadOnlyHandlers } from "../handlers/read-only.mjs";
import { createManagementHandlers } from "../handlers/management.mjs";
import { runBackupRestoreCommand } from "../handlers/backup-restore.mjs";
import { runSqlSmoke } from "../../commands/smoke/sql.mjs";

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
  if (command === "sql-smoke")
    return runSqlSmoke({
      client,
      createLive: dependencies.createLiveDb,
      createDb: dependencies.createDb,
      emit,
      config,
    });
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
  if (command === "migration-check" || command === "preflight") {
    const diagnose = dependencies.migrationDiagnostics ?? createMigrationDiagnostics();
    const configPath = argv.slice(1).find((argument) => !argument.startsWith("--"));
    return runMigrationDiagnostics({ diagnose, emit, endpoint: config.endpoint, configPath });
  }
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
