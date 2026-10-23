import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { gunzip } from "node:zlib";
import { promisify } from "node:util";
import { applicationDatabases } from "./application-databases.mjs";
import { sha256 } from "./hash-file.mjs";
import { hasBackupManifest, parseBackupManifest } from "./manifest.mjs";

const testGzip = promisify(gunzip);
export async function verifyBackup({ backupPath, databases, read = readFile, hash = sha256 }) {
  const databaseContent = await read(join(backupPath, "DATABASES"), "utf8");
  const checksumContent = await read(join(backupPath, "SHA256SUMS"), "utf8");
  const { databases: listed, hashes } = parseBackupManifest(databaseContent, checksumContent);
  const manifest = { databases: listed, hashes };
  const listedApplications = applicationDatabases(listed);
  if (!hasBackupManifest(manifest, listedApplications))
    throw new Error("backup manifest is incomplete");
  const expected = applicationDatabases(databases ?? listed);
  if (expected.length === 0) throw new Error("backup database list is empty");
  if (expected.some((database) => !listed.includes(database)))
    throw new Error("backup database is not listed in the manifest");
  for (const database of expected) {
    const file = join(backupPath, `${database}.sql.gz`);
    const content = await read(file);
    await testGzip(content);
    const actual =
      hash === sha256
        ? createHash("sha256").update(content).digest("hex")
        : await hash(file, content);
    if (hashes.get(`${database}.sql.gz`) !== actual)
      throw new Error(`backup hash mismatch: ${database}.sql.gz`);
  }
  try {
    const metadataPath = join(backupPath, "SUPERVISOR-METADATA.json");
    const metadata = await read(metadataPath);
    if (metadata !== undefined) {
      const actual =
        hash === sha256
          ? createHash("sha256").update(metadata).digest("hex")
          : await hash(metadataPath, metadata);
      if (hashes.get("SUPERVISOR-METADATA.json") !== actual)
        throw new Error("backup hash mismatch: SUPERVISOR-METADATA.json");
    }
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  return { databases: listed, host: undefined };
}
