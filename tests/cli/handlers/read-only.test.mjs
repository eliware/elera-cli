import { expect, test } from "@jest/globals";
import { createReadOnlyHandlers } from "../../../src/cli/handlers/read-only.mjs";

test("creates handlers for read-only command families", () => {
  const handlers = createReadOnlyHandlers({ config: {}, argv: [] });
  expect(handlers.health).toEqual(expect.any(Function));
  expect(handlers.routingWatch).toEqual(expect.any(Function));
});
