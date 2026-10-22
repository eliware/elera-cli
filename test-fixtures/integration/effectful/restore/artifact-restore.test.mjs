import { expect, jest, test } from "@jest/globals";
import { createHash } from "node:crypto";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { gzipSync } from "node:zlib";
import { restoreArtifact } from "../../../../src/restore/artifact/restore.mjs";

test("artifact restore requires confirmation before reading or mutating state", async () => {
  await expect(restoreArtifact({ root: "unused", client: {} })).rejects.toThrow(/confirm/);
});

test("artifact restore applies metadata, secrets, and application SQL while skipping system schemas", async () => {
  const root = await mkdtemp(join(tmpdir(), "elera-artifact-"));
  await writeFile(
    join(root, "SUPERVISOR-METADATA.json"),
    JSON.stringify({
      databases: ["app"],
      identities: ["runtime"],
      accounts: [{ user: "app", host: "%" }],
      artifacts: [{ name: "ssh", ciphertext: "age-encryption.org/v1/x" }],
    }),
  );
  await writeFile(join(root, "DATABASES"), "mysql\napp\nsys\n");
  const dump = gzipSync("unused");
  await writeFile(join(root, "app.sql.gz"), dump);
  await writeFile(
    join(root, "SHA256SUMS"),
    `${createHash("sha256").update(dump).digest("hex")}  app.sql.gz\n`,
  );
  const client = {
    restoreMetadataApply: jest.fn(),
    restoreAccountsApply: jest.fn(),
    putSecret: jest.fn(),
  };
  const restore = jest.fn(async (_binary, _args, stream) => {
    for await (const _chunk of stream) {
    }
  });
  await expect(
    restoreArtifact({
      root,
      client,
      bundle: { host: "db", port: 3306, username: "root", password: "secret", database: "app" },
      confirm: true,
      restore,
    }),
  ).resolves.toMatchObject({ restored: ["app"] });
  expect(client.restoreMetadataApply).toHaveBeenCalled();
  expect(client.restoreAccountsApply).toHaveBeenCalled();
  expect(client.putSecret).toHaveBeenCalledWith(
    "ssh",
    expect.objectContaining({ ciphertext: "age-encryption.org/v1/x" }),
  );
  expect(restore).toHaveBeenCalledTimes(1);
});

test("artifact restore supports metadata without accounts", async () => {
  const root = await mkdtemp(join(tmpdir(), "elera-artifact-"));
  await writeFile(join(root, "SUPERVISOR-METADATA.json"), "{}");
  await writeFile(join(root, "DATABASES"), "app\n");
  const dump = gzipSync("unused");
  await writeFile(join(root, "app.sql.gz"), dump);
  await writeFile(
    join(root, "SHA256SUMS"),
    `${createHash("sha256").update(dump).digest("hex")}  app.sql.gz\n`,
  );
  await expect(
    restoreArtifact({
      root,
      client: { restoreMetadataApply: jest.fn() },
      bundle: {
        username: "u",
        password: "p",
        database: "app",
        routes: { primary: [{ host: "db" }] },
      },
      confirm: true,
      restore: jest.fn(async (_binary, _args, stream) => {
        for await (const _chunk of stream) {
        }
      }),
    }),
  ).resolves.toMatchObject({ restored: ["app"] });
});
