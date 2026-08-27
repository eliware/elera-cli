import { expect, jest, test } from "@jest/globals";
import { createArtifactCommands } from "../src/artifacts/commands.mjs";

test("dispatches artifact commands and encrypts file content before put", async () => {
  const calls = [];
  const client = {
    listSecrets: async () => "list",
    getSecret: async (name) => ["get", name],
    verifySecret: async (name) => ["verify", name],
    removeSecret: async (name) => ["delete", name],
    putSecret: async (...args) => ["put", ...args],
  };
  const run = createArtifactCommands({
    client,
    age: { encrypt: async (value) => `age:${value}` },
    read: async () => "plain",
    emit: (value) => calls.push(value),
  });
  for (const command of [
    "secret-list",
    "secret-get",
    "secret-verify",
    "secret-delete",
  ])
    await expect(
      run(command, command === "secret-list" ? [] : ["name"]),
    ).resolves.toBe(true);
  await expect(run("secret-put", ["name", "file", "ssh", "k1"])).resolves.toBe(
    true,
  );
  await expect(run("secret-put", ["name", "file"])).resolves.toBe(true);
  expect(calls.at(-2)).toEqual([
    "put",
    "name",
    { kind: "ssh", keyVersion: "k1", ciphertext: "age:plain" },
  ]);
  expect(calls.at(-1)).toEqual([
    "put",
    "name",
    { kind: "opaque", keyVersion: "default", ciphertext: "age:plain" },
  ]);
  expect(await run("other", [])).toBe(false);
});
test("validates artifact command arguments and dependencies", async () => {
  expect(() => createArtifactCommands()).toThrow("dependencies");
  const run = createArtifactCommands({ client: {}, age: {}, emit: jest.fn() });
  await expect(run("secret-get", [])).rejects.toThrow("requires a name");
  await expect(run("secret-put", ["name"])).rejects.toThrow("file path");
  await expect(run("secret-unknown", ["name"])).resolves.toBe(false);
});
