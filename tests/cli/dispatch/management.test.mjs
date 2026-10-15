import { expect, test } from "@jest/globals";
import { dispatchManagement } from "../../../src/cli/dispatch/management.mjs";
import "../../../test-fixtures/integration/cli/dispatch/management-suite.mjs";

test("dispatches management commands", () => {
  expect(dispatchManagement).toEqual(expect.any(Function));
});
