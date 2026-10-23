import * as subject from "../../../../src/backup/verify-backup.mjs";
import { expect, test } from "@jest/globals";
import { createHash } from "node:crypto";
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

test("verifies every application database listed in a backup set", async () => {
  const first = gzipSync("first");
  const second = gzipSync("second");
  const files = new Map([
    ["DATABASES", "app\narchive\n"],
    [
      "SHA256SUMS",
      `${createHash("sha256").update(first).digest("hex")}  app.sql.gz\n${createHash("sha256").update(second).digest("hex")}  archive.sql.gz\n`,
    ],
    ["app.sql.gz", first],
    ["archive.sql.gz", second],
  ]);
  const reads = [];
  const read = async (path) => {
    const name = path.split(/[\\/]/).at(-1);
    reads.push(name);
    return files.get(name);
  };
  await expect(verifyBackup({ backupPath: "backup", read })).resolves.toMatchObject({
    databases: ["app", "archive"],
  });
  expect(reads).toContain("archive.sql.gz");
  files.set(
    "SHA256SUMS",
    `${createHash("sha256").update(first).digest("hex")}  app.sql.gz\n0000  archive.sql.gz\n`,
  );
  await expect(verifyBackup({ backupPath: "backup", read })).rejects.toThrow(
    "backup hash mismatch: archive.sql.gz",
  );
});

test("rejects empty or incomplete backup manifests", async () => {
  const files = new Map([
    ["DATABASES", ""],
    ["SHA256SUMS", ""],
  ]);
  const read = async (path) => files.get(path.split(/[\\/]/).at(-1));
  await expect(verifyBackup({ backupPath: "backup", read })).rejects.toThrow(
    "backup manifest is incomplete",
  );
  files.set("DATABASES", "app\n");
  await expect(verifyBackup({ backupPath: "backup", read })).rejects.toThrow(
    "backup manifest is incomplete",
  );
});

test("rejects a requested database outside the manifest", async () => {
  const content = gzipSync("sql");
  const files = new Map([
    ["DATABASES", "app\n"],
    ["SHA256SUMS", `${createHash("sha256").update(content).digest("hex")}  app.sql.gz\n`],
  ]);
  const read = async (path) => files.get(path.split(/[\\/]/).at(-1));
  await expect(verifyBackup({ backupPath: "backup", databases: ["other"], read })).rejects.toThrow(
    "backup database is not listed in the manifest",
  );
});

test("rejects an empty requested database list", async () => {
  const content = gzipSync("sql");
  const files = new Map([
    ["DATABASES", "app\n"],
    ["SHA256SUMS", `${createHash("sha256").update(content).digest("hex")}  app.sql.gz\n`],
  ]);
  const read = async (path) => files.get(path.split(/[\\/]/).at(-1));
  await expect(verifyBackup({ backupPath: "backup", databases: [], read })).rejects.toThrow(
    "backup database list is empty",
  );
});

test("verifies metadata checksums and permits artifacts without metadata", async () => {
  const dump = gzipSync("sql");
  const metadata = Buffer.from('{"accounts":[]}');
  const files = new Map([
    ["DATABASES", "app\n"],
    [
      "SHA256SUMS",
      `${createHash("sha256").update(dump).digest("hex")}  app.sql.gz\n${createHash("sha256").update(metadata).digest("hex")}  SUPERVISOR-METADATA.json\n`,
    ],
    ["app.sql.gz", dump],
    ["SUPERVISOR-METADATA.json", metadata],
  ]);
  const read = async (path) => {
    const name = path.split(/[\\/]/).at(-1);
    if (!files.has(name)) throw Object.assign(new Error("missing"), { code: "ENOENT" });
    return files.get(name);
  };
  await expect(verifyBackup({ backupPath: "backup", read })).resolves.toMatchObject({
    databases: ["app"],
  });
  files.set("SUPERVISOR-METADATA.json", Buffer.from("changed"));
  await expect(verifyBackup({ backupPath: "backup", read })).rejects.toThrow(
    "backup hash mismatch: SUPERVISOR-METADATA.json",
  );
  files.delete("SUPERVISOR-METADATA.json");
  await expect(verifyBackup({ backupPath: "backup", read })).resolves.toMatchObject({
    databases: ["app"],
  });
});

test("uses an injected hash function for metadata files", async () => {
  const dump = gzipSync("sql");
  const files = new Map([
    ["DATABASES", "app\n"],
    ["SHA256SUMS", "custom  app.sql.gz\ncustom  SUPERVISOR-METADATA.json\n"],
    ["app.sql.gz", dump],
    ["SUPERVISOR-METADATA.json", Buffer.from("metadata")],
  ]);
  const read = async (path) => files.get(path.split(/[\\/]/).at(-1));
  await expect(
    verifyBackup({ backupPath: "backup", read, hash: async () => "custom" }),
  ).resolves.toMatchObject({ databases: ["app"] });
});
