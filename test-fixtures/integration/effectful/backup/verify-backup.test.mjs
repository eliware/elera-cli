import * as subject from "../../../../src/backup/verify-backup.mjs";
import { expect, test } from "@jest/globals";
import { mkdtemp, writeFile } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import { join } from "node:path";
import { tmpdir } from "node:os";
const { verifyBackup } = subject;
test("exports backup verification operations", () =>
  expect(Object.keys(subject).length).toBeGreaterThan(0));

test("verifies backups with an injected hash function", async () => {
  const root = await mkdtemp(join(tmpdir(), "elera-backup-hash-"));
  const dump = gzipSync("sql");
  await writeFile(join(root, "DATABASES"), "app\n");
  await writeFile(join(root, "app.sql.gz"), dump);
  await writeFile(join(root, "SHA256SUMS"), "custom  app.sql.gz\n");
  await expect(
    verifyBackup({ backupPath: root, hash: async () => "custom" }),
  ).resolves.toMatchObject({ databases: ["app"] });
  await expect(verifyBackup({ backupPath: root, hash: async () => "wrong" })).rejects.toThrow(
    "backup hash mismatch",
  );
});
