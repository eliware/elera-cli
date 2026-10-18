import { expect, jest, test } from "@jest/globals";
import { createRoutingBundleEndpoints } from "../../../src/client/routing/bundle-endpoints.mjs";
test("retrieves and validates routing bundles", async () => {
  const request = jest.fn(async () => ({ data: { ok: true } }));
  const validate = jest.fn((value) => value);
  await expect(createRoutingBundleEndpoints(request, validate).routingBundle("a")).resolves.toEqual(
    { ok: true },
  );
  expect(validate).toHaveBeenCalled();
});
