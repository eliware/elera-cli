import { jest } from "@jest/globals";
import { runReconcile } from "../../../src/commands/metadata/reconcile.mjs";
test("runs each reconciliation operation", async () => {
  const emit = jest.fn();
  const client = {
    reconcilePlan: async (value) => ({ ok: true, value }),
    reconcileApply: async (value) => ({ ok: true, value }),
    reconcileVerify: async (value) => ({ ok: true, value }),
  };
  for (const command of ["reconcile-plan", "reconcile-apply", "reconcile-verify"])
    expect(await runReconcile({ client, emit, command, value: "{}" })).toBe(0);
  expect(emit).toHaveBeenCalledTimes(3);
});

test("fails reconciliation on negative or incomplete responses", async () => {
  const client = {
    reconcilePlan: async () => ({ ok: false }),
    reconcileApply: async () => ({}),
    reconcileVerify: async () => undefined,
  };
  for (const command of ["reconcile-plan", "reconcile-apply", "reconcile-verify"])
    await expect(runReconcile({ client, emit: jest.fn(), command, value: "{}" })).resolves.toBe(1);
});
