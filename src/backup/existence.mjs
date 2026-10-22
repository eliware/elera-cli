import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function backupExists(backupPath, read = readFile) {
  try {
    const listed = (await read(join(backupPath, "DATABASES"), "utf8"))
      .split(/\r?\n/)
      .filter(Boolean);
    const manifest = (await read(join(backupPath, "SHA256SUMS"), "utf8"))
      .split(/\r?\n/)
      .filter(Boolean);
    return (
      listed.length > 0 &&
      listed.every((name) => manifest.some((line) => line.trim().endsWith(`  ${name}.sql.gz`)))
    );
  } catch {
    return false;
  }
}
