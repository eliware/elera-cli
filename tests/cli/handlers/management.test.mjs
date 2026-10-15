import { expect, test } from "@jest/globals";
import { createManagementHandlers } from "../../../src/cli/handlers/management.mjs";

test("creates handlers for management command families", () => {
  const handlers = createManagementHandlers();
  expect(handlers.databaseCreate).toEqual(expect.any(Function));
  expect(handlers.coldRecoveryComplete).toEqual(expect.any(Function));
});
