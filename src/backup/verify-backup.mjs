import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { gunzip } from "node:zlib";
import { promisify } from "node:util";
import { applicationDatabases } from "./application-databases.mjs";
import { sha256 } from "./hash-file.mjs";

const testGzip = promisify(gunzip);
export async function verifyBackup({ backupPath, databases, read = readFile, hash = sha256 }) {
  const listed = (await read(join(backupPath, "DATABASES"), "utf8")).split(/\r?\n/).filter(Boolean);
  const expected = applicationDatabases(databases ?? listed);
  const manifest = (await read(join(backupPath, "SHA256SUMS"), "utf8"))
    .split(/\r?\n/)
    .filter(Boolean);
  const hashes = new Map(
    manifest.map((line) => {
      const [value, name] = line.trim().split(/\s+/, 2);
      return [name, value];
    }),
  );
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
  return { databases: listed, host: undefined };
}
