import { expect, jest, test } from "@jest/globals";
import { createCredentialEndpoints } from "../../src/client/credential-endpoints.mjs";
test("leases and refreshes validated credentials", async () => {
  const request = jest.fn(async () => ({ data: { ok: true } }));
  const validate = jest.fn((value) => value);
  const endpoints = createCredentialEndpoints(request, validate);
  await endpoints.lease("db", "id");
  await endpoints.refreshCredentials("id");
  expect(validate).toHaveBeenCalledTimes(2);
});
