import { expect, jest, test } from "@jest/globals";
import { createSystemEndpoints } from "../../src/client/system-endpoints.mjs";
test("creates operation and node system endpoints", async () => {
  const request = jest.fn(async () => ({ ok: true }));
  const endpoints = createSystemEndpoints(request);
  await endpoints.operationStatus("a/b");
  await endpoints.resetNodeData("node", {
    confirm: "RESET node",
    recoveryDisposition: "single-member-resync",
  });
  expect(request).toHaveBeenCalledTimes(2);
  expect(request.mock.calls[0][0]).toBe("/api/v1/operations/a%2Fb");
  expect(JSON.parse(request.mock.calls[1][1].body)).toEqual({
    node: "node",
    confirm: "RESET node",
    recoveryDisposition: "single-member-resync",
  });
});

test("uses the default node reset input", async () => {
  const request = jest.fn(async () => ({ ok: true }));
  await createSystemEndpoints(request).resetNodeData("node");
  expect(request).toHaveBeenCalledWith("/api/v1/node/data/reset", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ node: "node" }),
  });
});
