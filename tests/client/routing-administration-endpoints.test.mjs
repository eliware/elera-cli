import { expect, jest, test } from "@jest/globals";
import { createRoutingAdministrationEndpoints } from "../../src/client/routing-administration-endpoints.mjs";
test("creates routing administration endpoints", async () => {
  const request = jest.fn(async () => ({ ok: true }));
  const endpoints = createRoutingAdministrationEndpoints(request);
  await endpoints.resync("app");
  await endpoints.routingValidate("app");
  await endpoints.routingEvents("app");
  await endpoints.routingRebalance("app");
  expect(request).toHaveBeenCalledTimes(4);
});
