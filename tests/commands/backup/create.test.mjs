import { jest } from "@jest/globals";
import { runBackup } from "../../../src/commands/backup/create.mjs";
test("creates a metadata-bearing backup", async () => {
  const createBackup = jest.fn();
  const client = {
    sqlConnection: async () => ({ data: { username: "elera_t_1", host: "db" } }),
    lease: async () => ({}),
    metadataExport: async () => ({ data: { databases: ["db"] } }),
    exportAccounts: async () => ({ accounts: [] }),
  };
  await runBackup({
    client,
    createBackup,
    emit: jest.fn(),
    database: "db",
    identity: "id",
    root: "root",
  });
  expect(createBackup).toHaveBeenCalledWith(
    expect.objectContaining({
      backupRoot: "root",
      databases: ["db"],
      metadata: expect.any(Object),
    }),
  );
});

test("uses the root SQL account to back up every managed database and metadata", async () => {
  const createBackup = jest.fn();
  const client = {
    sqlConnection: async () => ({ data: { host: "db", username: "elera_root" } }),
    metadataExport: async () => ({
      data: { databases: [{ name: "primary", physical_name: "elera_db_1" }], metadataSnapshot: {} },
    }),
    exportAccounts: async () => ({ accounts: [{ user: "elera_t_1" }] }),
  };
  await runBackup({
    client,
    createBackup,
    emit: jest.fn(),
    database: "ignored",
    identity: "ignored",
    root: "root",
    token: "root-secret",
  });
  expect(createBackup).toHaveBeenCalledWith(
    expect.objectContaining({
      bundle: {
        host: "db",
        username: "elera_root",
        password: "root-secret",
        database: "elera_meta",
      },
      databases: ["elera_db_1", "elera_meta"],
      metadata: expect.objectContaining({
        metadataSnapshot: {},
        accounts: [{ user: "elera_t_1" }],
      }),
    }),
  );
});
