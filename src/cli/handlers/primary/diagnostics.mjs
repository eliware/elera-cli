import { createMigrationDiagnostics } from "../../../migration/diagnostics.mjs";
import { runMigrationDiagnostics } from "../../../commands/diagnostics/migration.mjs";

export function runPrimaryMigrationDiagnostics({
  dependencies,
  argv,
  config,
  emit,
  createDiagnostics = createMigrationDiagnostics,
}) {
  const diagnose = dependencies.migrationDiagnostics ?? createDiagnostics();
  const configPath = argv.slice(1).find((argument) => !argument.startsWith("--"));
  return runMigrationDiagnostics({ diagnose, emit, endpoint: config.endpoint, configPath });
}
