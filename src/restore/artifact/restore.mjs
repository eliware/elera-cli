import { createReadStream } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { createGunzip } from "node:zlib";
import { runRestore } from "../verify.mjs";
import { validateDatabaseName } from "../../database/validate-name.mjs";
import { verifyBackup } from "../../backup/verify-backup.mjs";
import { applyArtifactMetadata } from "./metadata.mjs";

const readNames = async (root, read) =>
  (await read(join(root, "DATABASES"), "utf8"))
    .split(/\r?\n/)
    .map((value) => value.trim())
    .filter(Boolean);

export async function restoreArtifact({
  root,
  client,
  bundle,
  lease,
  confirm = false,
  restore = runRestore,
  read = readFile,
}) {
  if (!confirm)
    throw Object.assign(new Error("artifact restore requires confirm: true"), { statusCode: 409 });
  await verifyBackup({ backupPath: root, read });
  const metadata = JSON.parse(await read(join(root, "SUPERVISOR-METADATA.json"), "utf8"));
  const accountCount = await applyArtifactMetadata(metadata, client);
  const targetBundle = lease ? await lease() : bundle;
  const profile = {
    ...targetBundle,
    ...targetBundle.credentials,
    host: targetBundle.host ?? targetBundle.routes?.primary?.[0]?.host,
    port: targetBundle.port ?? targetBundle.routes?.primary?.[0]?.port,
  };
  const databases = await readNames(root, read);
  const restored = [];
  for (const database of [
    ...databases.filter((name) => name !== "elera_meta"),
    ...databases.filter((name) => name === "elera_meta"),
  ]) {
    validateDatabaseName(database);
    if (["mysql", "sys", "information_schema", "performance_schema"].includes(database)) continue;
    await restore(
      "mariadb",
      [
        "--host",
        profile.host,
        "--port",
        String(profile.port ?? 3306),
        "--user",
        profile.username,
        database,
      ],
      createReadStream(join(root, `${database}.sql.gz`)).pipe(createGunzip()),
      { env: { MYSQL_PWD: profile.password } },
    );
    restored.push(database);
  }
  return {
    metadata: {
      databases: metadata.databases?.length ?? 0,
      identities: metadata.identities?.length ?? 0,
      accounts: accountCount,
    },
    restored,
  };
}
