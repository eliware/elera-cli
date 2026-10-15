import { jest } from "@jest/globals";
import { runSecretGet } from "../../../src/commands/protected-settings/get.mjs";
test("gets a secret", async () => {
  const getSecret = jest.fn(async () => ({ ok: true }));
  await runSecretGet({ client: { getSecret }, emit: jest.fn(), name: "x" });
  expect(getSecret).toHaveBeenCalledWith("x");
});
