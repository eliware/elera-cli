import { expect, test } from "@jest/globals";
import { backupExists } from "../../src/backup/existence.mjs";

test("detects a backup when every listed database appears in the manifest", async () => {
  const read = async (path) =>
    path.endsWith("DATABASES") ? "app\nidentity\n" : "hash  app.sql.gz\nhash  identity.sql.gz\n";
  await expect(backupExists("backup", read)).resolves.toBe(true);
});

test("rejects incomplete or unreadable backup manifests", async () => {
  const incomplete = async (path) =>
    path.endsWith("DATABASES") ? "app\n" : "hash  other.sql.gz\n";
  const empty = async (path) => (path.endsWith("DATABASES") ? "\n" : "");
  const unreadable = async () => {
    throw new Error("missing");
  };
  await expect(backupExists("backup", incomplete)).resolves.toBe(false);
  await expect(backupExists("backup", empty)).resolves.toBe(false);
  await expect(backupExists("backup", unreadable)).resolves.toBe(false);
});
