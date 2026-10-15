import { expect, jest, test } from "@jest/globals";
import { runColdRecoveryPlan } from "../../../src/commands/recovery/plan.mjs";
test("returns failure for an ineligible recovery plan", async () => {
  const emit = jest.fn();
  await expect(
    runColdRecoveryPlan({
      client: { coldRecoveryPlan: jest.fn(async () => ({ ok: true, data: { eligible: false } })) },
      emit,
    }),
  ).resolves.toBe(1);
});
