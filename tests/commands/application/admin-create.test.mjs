import { expect, jest, test } from "@jest/globals";
import { runAppAdminCreate } from "../../../src/commands/application/admin-create.mjs";
test("creates an application administrator token", async () => {
  const emit = jest.fn();
  await expect(
    runAppAdminCreate({
      client: { createAppAdminToken: jest.fn(async () => ({ ok: true })) },
      emit,
      application: "app",
      tokenName: "admin",
    }),
  ).resolves.toBe(0);
  expect(emit).toHaveBeenCalled();
});
