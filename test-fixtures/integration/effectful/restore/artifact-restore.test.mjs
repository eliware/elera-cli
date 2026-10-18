import "../../artifact-restore-coverage.mjs";
import { expect, jest, test } from "@jest/globals";
import { createHash } from "node:crypto";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { gzipSync } from "node:zlib";
import { restoreArtifact } from "../../../../src/restore/artifact-restore.mjs";

test("artifact restore requires confirmation before reading or mutating state", async () => {
  await expect(restoreArtifact({ root: "unused", client: {} })).rejects.toThrow(/confirm/);
});

test("artifact restore restores metadata before application SQL", async () => {
  const root = await mkdtemp(join(tmpdir(), "elera-artifact-"));
  const dump = gzipSync("unused");
  await writeFile(join(root, "app.sql.gz"), dump);
  await writeFile(join(root, "DATABASES"), "app\n");
  await writeFile(
    join(root, "SHA256SUMS"),
    `${createHash("sha256").update(dump).digest("hex")}  app.sql.gz\n`,
  );
  await writeFile(
    join(root, "SUPERVISOR-METADATA.json"),
    JSON.stringify({ databases: [], identities: [], accounts: [{ user: "app", host: "%" }] }),
  );
  const client = { restoreMetadataApply: jest.fn(), restoreAccountsApply: jest.fn() };
  const restore = jest.fn();
  await restoreArtifact({
    root,
    client,
    bundle: { host: "db", port: 3306, username: "root", password: "secret" },
    confirm: true,
    restore,
  });
  expect(client.restoreMetadataApply).toHaveBeenCalled();
  expect(client.restoreAccountsApply).toHaveBeenCalled();
  expect(restore).toHaveBeenCalled();
});
