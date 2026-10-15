import "../../test-fixtures/integration/barrels/client/endpoint-helpers.mjs";
import { expect, jest, test } from "@jest/globals";
import { jsonRequest } from "../../src/client/request-json.mjs";
test("builds JSON request options", async () => {
  const request = jest.fn(async (_path, options) => options);
  await expect(jsonRequest(request, "/path", { ok: true })).resolves.toEqual({
    method: "POST",
    body: '{"ok":true}',
    headers: { "content-type": "application/json" },
  });
});
