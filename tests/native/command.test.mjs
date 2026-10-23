import { expect, jest, test } from "@jest/globals";
import { runNativeCommand } from "../../src/native/command.mjs";

const bundle = {
  credentials: { username: "elera_t_123", password: "sql-secret" },
  writer: { host: "db.example.test", port: 3307 },
  routes: { primary: [{ host: "fallback.example.test", port: 3308 }] },
};

test("gets connection details from the authenticated routing bundle", async () => {
  const client = { routingBundle: jest.fn(async () => bundle) };
  const run = jest.fn(async () => 0);
  await expect(
    runNativeCommand({ client, kind: "sql", args: ["-e", "SHOW DATABASES;"], run }),
  ).resolves.toBe(0);
  expect(client.routingBundle).toHaveBeenCalledWith();
  expect(run).toHaveBeenCalledWith({
    binary: "mysql",
    args: ["-e", "SHOW DATABASES;"],
    connection: {
      host: "db.example.test",
      port: 3307,
      username: "elera_t_123",
      password: "sql-secret",
    },
  });
});

test("wraps the native dump command and rejects a bundle without a writer route", async () => {
  const run = jest.fn(async () => 0);
  await expect(
    runNativeCommand({
      client: { routingBundle: async () => ({ ...bundle, writer: null }) },
      kind: "dump",
      args: ["--all-databases"],
      run,
    }),
  ).rejects.toThrow("routing bundle does not contain native SQL connection details");
  expect(run).not.toHaveBeenCalled();
});

test("passes dump flags to mysqldump unchanged", async () => {
  const run = jest.fn(async () => 0);
  await expect(
    runNativeCommand({
      client: { routingBundle: async () => bundle },
      kind: "dump",
      args: ["--all-databases", "--single-transaction"],
      run,
    }),
  ).resolves.toBe(0);
  expect(run.mock.calls[0][0]).toMatchObject({
    binary: "mysqldump",
    args: ["--all-databases", "--single-transaction"],
  });
});

test("rejects unsupported commands and incomplete routing bundles", async () => {
  await expect(runNativeCommand({ client: {}, kind: "sql", args: [] })).rejects.toThrow(
    "supervisor client is required",
  );
  await expect(
    runNativeCommand({ client: { routingBundle: async () => ({}) }, kind: "sql", args: [] }),
  ).rejects.toThrow("routing bundle does not contain native SQL connection details");
  await expect(
    runNativeCommand({ client: { routingBundle: async () => bundle }, kind: "backup", args: [] }),
  ).rejects.toThrow("native client kind is invalid");
});
