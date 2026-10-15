import { expect, jest, test } from "@jest/globals";
import { createConfigurationEndpoints } from "../../src/client/configuration-endpoints.mjs";
test("creates configuration and initialization endpoints", async () => {
  const request = jest.fn(async () => ({ ok: true }));
  const endpoints = createConfigurationEndpoints(request);
  await endpoints.intent();
  await endpoints.plan({});
  await endpoints.apply({});
  await endpoints.verify();
  await endpoints.initializationStatus();
  await endpoints.metadataStatus();
  expect(request).toHaveBeenCalledTimes(6);
});
