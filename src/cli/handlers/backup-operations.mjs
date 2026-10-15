import { runDump } from "../../commands/backup/dump.mjs";
import { runRestore } from "../../commands/backup/restore.mjs";
import { runBackup } from "../../commands/backup/create.mjs";
import { runBackupVerify } from "../../commands/backup/verify.mjs";
import { runRestoreVerify } from "../../commands/restore/verify.mjs";
import { runRestoreArtifact } from "../../commands/restore/artifact.mjs";
import { runRestoreMetadataPlan } from "../../commands/restore/metadata-plan.mjs";
import { runRestoreMetadataApply } from "../../commands/restore/metadata-apply.mjs";
import { runRestoreAccountsPlan } from "../../commands/restore/accounts-plan.mjs";
import { runRestoreAccountsApply } from "../../commands/restore/accounts-apply.mjs";
import { runRestoreAccountsVerify } from "../../commands/restore/accounts-verify.mjs";

export function createBackupRestoreOperations({ command, dependencies }) {
  return {
    native: ({ client: targetClient, emit: targetEmit, database, identity, file }) =>
      (command === "dump" ? runDump : runRestore)({
        client: targetClient,
        dump: dependencies.dump,
        restore: dependencies.restore,
        emit: targetEmit,
        database,
        identity,
        file,
      }),
    backup: ({ client: targetClient, emit: targetEmit, database, identity, root, databases }) =>
      runBackup({
        client: targetClient,
        createBackup: dependencies.createBackup,
        emit: targetEmit,
        database,
        identity,
        root,
        databases,
      }),
    verify: ({ client: targetClient, emit: targetEmit, database, identity, root }) =>
      runBackupVerify({
        client: targetClient,
        verifyBackup: dependencies.verifyBackup,
        emit: targetEmit,
        database,
        identity,
        root,
      }),
    restoreVerify: ({ client: targetClient, emit: targetEmit, database, identity, root }) =>
      runRestoreVerify({
        client: targetClient,
        restoreVerify: dependencies.restoreVerify,
        emit: targetEmit,
        database,
        identity,
        root,
      }),
    artifact: ({ client: targetClient, emit: targetEmit, database, identity, root }) =>
      runRestoreArtifact({
        client: targetClient,
        restoreArtifact: dependencies.restoreArtifact,
        emit: targetEmit,
        database,
        identity,
        root,
      }),
    metadata: ({ client: targetClient, emit: targetEmit, command: operation, value }) =>
      (operation === "restore-metadata-plan" ? runRestoreMetadataPlan : runRestoreMetadataApply)({
        client: targetClient,
        emit: targetEmit,
        value,
      }),
    accounts: ({ client: targetClient, emit: targetEmit, command: operation, value }) =>
      (operation === "restore-accounts-plan"
        ? runRestoreAccountsPlan
        : operation === "restore-accounts-apply"
          ? runRestoreAccountsApply
          : runRestoreAccountsVerify)({ client: targetClient, emit: targetEmit, value }),
  };
}
