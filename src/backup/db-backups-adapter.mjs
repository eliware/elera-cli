import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createBackup } from "./create-backup.mjs";
import { verifyBackup } from "./verify-backup.mjs";
import { restoreVerify } from "../restore/verify.mjs";
import { syncToNas } from "../transport/nas.mjs";
export { withBundleCredentials } from "./bundle-credentials.mjs";
import { normalizeBundleCredentials, withBundleCredentials } from "./bundle-credentials.mjs";

export function createBackupFromBundle({ bundle, backupRoot, databases, metadata, ...options }) {
  const profile = normalizeBundleCredentials(bundle);
  return createBackup({
    backupRoot,
    databases,
    host: profile.host,
    port: profile.port,
    username: profile.username,
    password: profile.password,
    mysqlDump: "mariadb-dump",
    ...options,
  }).then(async (result) => {
    await (metadata
      ? writeFile(
          join(result.path, "SUPERVISOR-METADATA.json"),
          `${JSON.stringify(metadata, null, 2)}\n`,
          { mode: 0o600 },
        )
      : Promise.resolve());
    if (metadata) {
      const metadataPath = join(result.path, "SUPERVISOR-METADATA.json");
      const { sha256 } = await import("./hash-file.mjs");
      const { readFile, writeFile: write } = await import("node:fs/promises");
      const { manifestText } = await import("./manifest-text.mjs");
      const databaseList = (await readFile(join(result.path, "DATABASES"), "utf8"))
        .split(/\r?\n/)
        .filter(Boolean);
      const entries = await Promise.all(
        databaseList.map(async (database) => ({
          hash: await sha256(join(result.path, `${database}.sql.gz`)),
          name: `${database}.sql.gz`,
        })),
      );
      entries.push({ hash: await sha256(metadataPath), name: "SUPERVISOR-METADATA.json" });
      await write(join(result.path, "SHA256SUMS"), manifestText(entries));
    }
    return result;
  });
}

export function verifyBackupFromBundle({ bundle, backupPath, databases, ...options }) {
  normalizeBundleCredentials(bundle);
  return verifyBackup({ backupPath, databases, ...options });
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
