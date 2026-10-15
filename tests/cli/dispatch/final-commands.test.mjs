import { expect, jest, test } from "@jest/globals";
import { dispatchFinalCommands } from "../../../src/cli/dispatch/final-commands.mjs";

test("returns the invalid code for an unknown final command", async () => {
  const errorOutput = { write: jest.fn() };
  const result = await dispatchFinalCommands({
    command: "unknown",
    client: {},
    controlClient: {},
    emit: jest.fn(),
    argv: [],
    environment: {},
    dependencies: { createLifecycleCommands: () => ({}) },
    errorOutput,
  });
  expect(result).toBe(2);
  expect(errorOutput.write).toHaveBeenCalledWith("unknown command: unknown\n");
});
