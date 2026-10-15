import { expect, jest, test } from "@jest/globals";
import { createReconcileEndpoints } from "../../src/client/reconcile-endpoints.mjs";
test("creates reconcile endpoints", async () => {
  const request = jest.fn(async () => ({ ok: true }));
  const endpoints = createReconcileEndpoints(request);
  await endpoints.reconcilePlan({});
  await endpoints.reconcileApply({});
  await endpoints.reconcileVerify({});
  expect(request).toHaveBeenCalledTimes(3);
});
