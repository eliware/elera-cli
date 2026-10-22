import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { hasBackupManifest, parseBackupManifest } from "./manifest.mjs";

export async function backupExists(backupPath, read = readFile) {
  try {
    const databaseContent = await read(join(backupPath, "DATABASES"), "utf8");
    const checksumContent = await read(join(backupPath, "SHA256SUMS"), "utf8");
    return hasBackupManifest(parseBackupManifest(databaseContent, checksumContent));
  } catch {
    return false;
  }
}
