import { jest } from "@jest/globals";
import { runRestoreArtifact } from "../../../src/commands/restore/artifact.mjs";
test("restores a complete artifact with confirmation", async () => {
  const client = { lease: jest.fn(async () => ({ username: "user" })) };
  const restoreArtifact = jest.fn(async ({ lease }) => {
    await lease();
    return { restored: [] };
  });
  await runRestoreArtifact({
    client,
    restoreArtifact,
    emit: jest.fn(),
    database: "db",
    identity: "id",
    root: "root",
  });
  expect(restoreArtifact).toHaveBeenCalledWith(
    expect.objectContaining({ root: "root", confirm: true, lease: expect.any(Function) }),
  );
  expect(client.lease).toHaveBeenCalledWith("db", "id");
});

test("uses the persistent root SQL account when it is available", async () => {
  const client = {
    sqlConnection: jest.fn(async () => ({ data: { username: "elera_root", host: "db" } })),
    lease: jest.fn(),
  };
  const restoreArtifact = jest.fn(async ({ lease }) => lease());
  await runRestoreArtifact({
    client,
    restoreArtifact,
    emit: jest.fn(),
    database: "app",
    identity: "app",
    root: "root",
    token: "x",
  });
  expect(restoreArtifact.mock.calls[0][0].lease()).toEqual({
    username: "elera_root",
    host: "db",
    password: "x",
    database: "elera_meta",
  });
  expect(client.lease).not.toHaveBeenCalled();
});
