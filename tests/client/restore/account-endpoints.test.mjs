import { expect, jest, test } from "@jest/globals";
import { createRestoreAccountEndpoints } from "../../../src/client/restore/account-endpoints.mjs";
test("creates account restore endpoints", async () => {
  const request = jest.fn(async () => ({ ok: true }));
  const endpoints = createRestoreAccountEndpoints(request);
  await endpoints.restoreAccountsPlan([]);
  await endpoints.restoreAccountsApply([]);
  await endpoints.restoreAccountsVerify([]);
  expect(request).toHaveBeenCalledTimes(3);
});
