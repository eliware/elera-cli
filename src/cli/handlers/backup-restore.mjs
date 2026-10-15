import { createArtifactCommands } from "../../state-materialization/commands.mjs";
import { createAgeProcess } from "../../state-materialization/age-process.mjs";
import { dispatchBackupRestore } from "../dispatch/backup-restore.mjs";
import { createBackupRestoreOperations } from "./backup-operations.mjs";
import { runSecretList } from "../../commands/protected-settings/list.mjs";
import { runSecretGet } from "../../commands/protected-settings/get.mjs";
import { runSecretVerify } from "../../commands/protected-settings/verify.mjs";
import { runSecretDelete } from "../../commands/protected-settings/delete.mjs";

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
  const secretHandlers = {
    "secret-list": runSecretList,
    "secret-get": runSecretGet,
    "secret-verify": runSecretVerify,
    "secret-delete": runSecretDelete,
  };
  return dispatchBackupRestore({
    command,
    client,
    emit,
    args,
    config,
    artifactCommands: async (name, values) => {
      if (secretHandlers[name]) return secretHandlers[name]({ client, emit, name: values[0] });
      await artifactCommands(name, values);
      return 0;
    },
    operations: createBackupRestoreOperations({ command, dependencies }),
  });
}
