import { expect, jest, test } from "@jest/globals";
import { runColdRecoveryBootstrap } from "../../../src/commands/recovery/bootstrap.mjs";
test("bootstraps cold recovery input", async () => {
  const emit = jest.fn();
  await expect(
    runColdRecoveryBootstrap({
      client: { coldRecoveryBootstrap: jest.fn(async () => ({ ok: true })) },
      emit,
      input: {},
    }),
  ).resolves.toBe(0);
});
