import { expect, jest, test } from "@jest/globals";
import { runColdRecoveryComplete } from "../../../src/commands/recovery/complete.mjs";
test("completes cold recovery input", async () => {
  const emit = jest.fn();
  await expect(
    runColdRecoveryComplete({
      client: { coldRecoveryComplete: jest.fn(async () => ({ ok: true })) },
      emit,
      input: {},
    }),
  ).resolves.toBe(0);
});
