import { expect, test } from "@jest/globals";
import { createLifecycleHandlers } from "../../../src/cli/handlers/lifecycle.mjs";

test("creates handlers for lifecycle commands", () => {
  const handlers = createLifecycleHandlers();
  expect(handlers.bootstrap).toEqual(expect.any(Function));
  expect(handlers.rejoin).toEqual(expect.any(Function));
});
