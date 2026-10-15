import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createBackup } from "./create-backup.mjs";
import { verifyBackup } from "./verify-backup.mjs";
import { restoreVerify } from "../restore/restore-verify.mjs";
import { syncToNas } from "../transport/nas.mjs";
export { withBundleCredentials } from "./bundle-credentials.mjs";
import { withBundleCredentials } from "./bundle-credentials.mjs";

export function createBackupFromBundle({ bundle, backupRoot, databases, metadata, ...options }) {
  return withBundleCredentials(bundle, async (credentialsFile, profile) => {
    const result = await createBackup({
      backupRoot,
      databases,
      credentialsFile,
      host: profile.host,
      mysqlDump: "mariadb-dump",
      ...options,
    });
    await (metadata
      ? writeFile(
          join(result.path, "SUPERVISOR-METADATA.json"),
          `${JSON.stringify(metadata, null, 2)}\n`,
          { mode: 0o600 },
        )
      : Promise.resolve());
    return result;
  });
}

export function verifyBackupFromBundle({ bundle, backupPath, databases, ...options }) {
  return withBundleCredentials(bundle, (credentialsFile, profile) =>
    verifyBackup({
      backupPath,
      databases,
      credentialsFile,
      host: profile.host,
      ...options,
    }),
  );
}

export function restoreVerifyFromBundle({ bundle, restoreRoot, ...options }) {
  return withBundleCredentials(bundle, (credentialsFile, profile) =>
    restoreVerify({
      restoreRoot,
      credentialsFile,
      host: profile.host,
      mysql: "mariadb",
      ...options,
    }),
  );
}

export { syncToNas };
