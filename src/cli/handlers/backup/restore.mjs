import { createArtifactCommands } from "../../../state-materialization/commands.mjs";
import { createAgeProcess } from "../../../state-materialization/age-process.mjs";
import { dispatchBackupRestore } from "../../dispatch/backup-restore.mjs";
import { createBackupRestoreOperations } from "./operations.mjs";
import { createSecretCommandHandler } from "./secrets.mjs";

export function runBackupRestoreCommand({
  command,
  client,
  emit,
  args,
  config,
  dependencies,
  environment,
}) {
  const artifactCommands = createArtifactCommands({
    client,
    age: dependencies.age ?? createAgeProcess({ environment }),
    materialize: dependencies.materialize,
    emit,
  });
  return dispatchBackupRestore({
    command,
    client,
    emit,
    args,
    config,
    artifactCommands: createSecretCommandHandler({ client, emit, artifactCommands }),
    operations: createBackupRestoreOperations({ command, dependencies }),
  });
}
