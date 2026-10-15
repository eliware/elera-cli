import { expect, jest, test } from "@jest/globals";
import { createAccountEndpoints } from "../../src/client/account-endpoints.mjs";
test("creates account endpoints", async () => {
  const request = jest.fn(async () => ({ ok: true }));
  const endpoints = createAccountEndpoints(request);
  await endpoints.accounts();
  await endpoints.provisionAccount({});
  await endpoints.revokeAccount({});
  await endpoints.verifyAccount({});
  await endpoints.exportAccounts();
  expect(request).toHaveBeenCalledTimes(5);
});
