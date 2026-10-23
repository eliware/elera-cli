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
