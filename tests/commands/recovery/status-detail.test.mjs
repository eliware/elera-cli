import { expect, jest, test } from "@jest/globals";
import { runColdRecoveryStatus } from "../../../src/commands/recovery/status-detail.mjs";
test("emits cold recovery status", async () => {
  const emit = jest.fn();
  await expect(
    runColdRecoveryStatus({
      client: { coldRecoveryStatus: jest.fn(async () => ({ ok: true })) },
      emit,
    }),
  ).resolves.toBe(0);
  expect(emit).toHaveBeenCalled();
});
