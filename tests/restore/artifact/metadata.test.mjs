import { expect, jest, test } from "@jest/globals";
import { applyArtifactMetadata } from "../../../src/restore/artifact/metadata.mjs";

test("applies database, account, and secret metadata", async () => {
  const client = {
    restoreMetadataApply: jest.fn(),
    restoreAccountsApply: jest.fn(),
    putSecret: jest.fn(),
  };
  const metadata = {
    databases: ["app"],
    identities: ["runtime"],
    accounts: [{ user: "app" }],
    artifacts: [{ name: "ssh", ciphertext: "cipher" }],
  };
  await expect(applyArtifactMetadata(metadata, client)).resolves.toBe(1);
  expect(client.restoreMetadataApply).toHaveBeenCalledWith(
    { databases: ["app"], identities: ["runtime"] },
    { idempotencyKey: expect.any(String) },
  );
  expect(client.restoreAccountsApply).toHaveBeenCalledWith(metadata.accounts, {
    idempotencyKey: expect.any(String),
  });
  expect(client.putSecret).toHaveBeenCalledWith("ssh", metadata.artifacts[0]);
});

test("uses empty metadata collections when they are absent", async () => {
  const client = { restoreMetadataApply: jest.fn() };
  await expect(applyArtifactMetadata({}, client)).resolves.toBe(0);
  expect(client.restoreMetadataApply).toHaveBeenCalledWith(
    { databases: [], identities: [] },
    { idempotencyKey: expect.any(String) },
  );
});
