import { expect, jest, test } from "@jest/globals";
import { createSecretCommandHandler } from "../../../../src/cli/handlers/backup/secrets.mjs";

test("secret command handler routes secret and artifact commands", async () => {
  const client = { listSecrets: jest.fn(async () => []) };
  const emit = jest.fn();
  const artifactCommands = jest.fn();
  const handle = createSecretCommandHandler({ client, emit, artifactCommands });
  await expect(handle("secret-list", [])).resolves.toBe(0);
  expect(client.listSecrets).toHaveBeenCalled();
  await expect(handle("artifact-list", ["--json"])).resolves.toBe(0);
  expect(artifactCommands).toHaveBeenCalledWith("artifact-list", ["--json"]);
});
