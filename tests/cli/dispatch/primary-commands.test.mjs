import { expect, test } from "@jest/globals";
import { dispatchPrimaryCommands } from "../../../src/cli/dispatch/primary-commands.mjs";

test("returns no result for an unknown primary command", async () => {
  const result = await dispatchPrimaryCommands({
    command: "unknown",
    client: {},
    controlClient: {},
    emit: () => {},
    args: [],
    config: {},
    dependencies: {},
    environment: {},
    argv: [],
    parsed: { options: {} },
  });
  expect(result).toBeUndefined();
});
