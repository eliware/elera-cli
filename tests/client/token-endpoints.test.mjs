import { jest } from "@jest/globals";
import { createTokenEndpoints } from "../../src/client/token-endpoints.mjs";

test("sends token endpoint requests", async () => {
  const request = jest.fn(async (path, options) => ({ path, options }));
  const endpoints = createTokenEndpoints(request);

  await expect(endpoints.tokens()).resolves.toEqual({ path: "/api/v1/tokens", options: undefined });
  await expect(endpoints.createToken({ name: "build" })).resolves.toMatchObject({
    path: "/api/v1/tokens",
  });
  await endpoints.rotateToken("build/name");
  await endpoints.revokeToken("build");

  expect(request.mock.calls.map(([path]) => path)).toEqual([
    "/api/v1/tokens",
    "/api/v1/tokens",
    "/api/v1/tokens/build%2Fname/rotate",
    "/api/v1/tokens/revoke",
  ]);
  expect(JSON.parse(request.mock.calls[1][1].body)).toEqual({ name: "build" });
  expect(JSON.parse(request.mock.calls[2][1].body)).toEqual({ confirm: true });
  expect(JSON.parse(request.mock.calls[3][1].body)).toEqual({ name: "build" });
});
