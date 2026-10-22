import { expect, test } from "@jest/globals";
import { hasBackupManifest, parseBackupManifest } from "../../src/backup/manifest.mjs";

test("parses database names and checksum entries", () => {
  const manifest = parseBackupManifest(
    "app\nidentity\n",
    "aabb  app.sql.gz\nccdd  identity.sql.gz\n",
  );
  expect(manifest.databases).toEqual(["app", "identity"]);
  expect(manifest.hashes.get("app.sql.gz")).toBe("aabb");
  expect(hasBackupManifest(manifest)).toBe(true);
});

test("checks requested database entries and rejects an empty list", () => {
  const manifest = parseBackupManifest("app\n", "aabb  app.sql.gz\n");
  expect(hasBackupManifest(manifest, ["app", "missing"])).toBe(false);
  expect(hasBackupManifest(parseBackupManifest("\n", ""))).toBe(false);
});
