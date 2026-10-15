import { expect, jest, test } from "@jest/globals";
import { createClusterObservabilityEndpoints } from "../../src/client/cluster-observability.mjs";
test("creates cluster observability endpoints", async () => {
  const request = jest.fn(async (path) => ({ path }));
  const endpoints = createClusterObservabilityEndpoints(request);
  await endpoints.observations();
  await endpoints.quorum();
  await endpoints.coldBootstrapPlan();
  await endpoints.coldBootstrapEvidence();
  expect(request).toHaveBeenCalledTimes(4);
});

test("uses the default cold-bootstrap input", async () => {
  const request = jest.fn(async () => ({ ok: true }));
  await createClusterObservabilityEndpoints(request).coldBootstrap();
  expect(request).toHaveBeenCalledWith("/api/v1/cluster/cold-bootstrap", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
});
