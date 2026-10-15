import { expect, jest, test } from "@jest/globals";
import { createIdentityEndpoints } from "../../src/client/identity-endpoints.mjs";
test("creates identity endpoints", async () => {
  const request = jest.fn(async () => ({ ok: true }));
  const endpoints = createIdentityEndpoints(request);
  await endpoints.identities("app");
  await endpoints.provisionIdentity({});
  await endpoints.rotateIdentity("id");
  expect(request).toHaveBeenCalledTimes(3);
});
