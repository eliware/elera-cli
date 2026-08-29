import { expect, jest, test } from "@jest/globals";
import { EventEmitter } from "node:events";
import { createMaterializeCommand } from "../../src/artifacts/materialize-command.mjs";

test("runs a command with a temporary decrypted artifact path", async () => {
  const child = new EventEmitter();
  const spawnImpl = jest.fn(() => {
    queueMicrotask(() => child.emit("close", 0));
    return child;
  });
  const run = createMaterializeCommand({
    client: { putSecret: jest.fn(), getSecret: jest.fn(async () => ({ ciphertext: "age-encryption.org/v1/x" })) },
    age: { encrypt: jest.fn(), decrypt: jest.fn(async () => "private") },
    spawnImpl,
  });
  await expect(run("ssh", "use-key", ["--quiet"])).resolves.toBeUndefined();
  expect(spawnImpl).toHaveBeenCalledWith(
    "use-key",
    ["--quiet", expect.stringContaining("elera-material-")],
    { stdio: "inherit" },
  );
});

test("rejects a failed materialized command", async () => {
  const child = new EventEmitter();
  const run = createMaterializeCommand({
    client: { putSecret: jest.fn(), getSecret: jest.fn(async () => ({ ciphertext: "age-encryption.org/v1/x" })) },
    age: { encrypt: jest.fn(), decrypt: jest.fn(async () => "private") },
    spawnImpl: () => {
      queueMicrotask(() => child.emit("close", 3));
      return child;
    },
  });
  await expect(run("ssh", "use-key")).rejects.toThrow("exited with code 3");
});

test("validates materialization arguments", async () => {
  const run = createMaterializeCommand({
    client: { putSecret: jest.fn(), getSecret: jest.fn() },
    age: { encrypt: jest.fn(), decrypt: jest.fn() },
    spawnImpl: jest.fn(),
  });
  await expect(run()).rejects.toThrow("requires name and command");
});
