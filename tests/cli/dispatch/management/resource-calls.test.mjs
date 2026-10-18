import { expect, test } from "@jest/globals";
import { createManagementResourceCalls } from "../../../../src/cli/dispatch/management/resource-calls.mjs";

test("creates resource management calls", () => {
  const calls = createManagementResourceCalls({ handlers: {} });
  expect(calls["database-create"]).toEqual(expect.any(Function));
  expect(calls["node-resync"]).toEqual(expect.any(Function));
});
