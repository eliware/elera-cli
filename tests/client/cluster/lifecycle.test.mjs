import { expect, jest, test } from "@jest/globals";
import { createClusterLifecycleEndpoints } from "../../../src/client/cluster/lifecycle.mjs";
test("creates cluster lifecycle endpoints", async () => {
  const request = jest.fn(async () => ({ ok: true }));
  const endpoints = createClusterLifecycleEndpoints(request);
  await endpoints.bootstrap();
  await endpoints.join();
  await endpoints.lifecyclePlan("drain");
  await endpoints.recover({ reason: "test" });
  expect(request).toHaveBeenCalledTimes(4);
});

test("uses the default recovery input", async () => {
  const request = jest.fn(async () => ({ ok: true }));
  await createClusterLifecycleEndpoints(request).recover();
  expect(request).toHaveBeenCalledWith("/api/v1/cluster/recover", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ confirm: true }),
  });
});
