import { expect, jest, test } from "@jest/globals";
import { createReadOnlyHandlers } from "../../../../src/cli/handlers/read/only.mjs";

test("creates handlers for read-only command families", () => {
  const handlers = createReadOnlyHandlers({ config: {}, argv: [] });
  expect(handlers.health).toEqual(expect.any(Function));
  expect(handlers.routingWatch).toEqual(expect.any(Function));
});

test("node evidence handler emits the cold bootstrap evidence", async () => {
  const emit = jest.fn();
  const evidence = { status: "ready" };
  const handlers = createReadOnlyHandlers({ config: {}, argv: [] });
  await expect(
    handlers.nodeEvidence({ client: { coldBootstrapEvidence: async () => evidence }, emit }),
  ).resolves.toBe(0);
  expect(emit).toHaveBeenCalledWith(evidence);
});
