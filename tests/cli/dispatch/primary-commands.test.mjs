import { expect, jest, test } from "@jest/globals";
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

test("preserves exact node confirmation phrases during dispatch", async () => {
  const emit = jest.fn();
  const resetNodeData = jest.fn(async () => ({ ok: true }));
  const result = await dispatchPrimaryCommands({
    command: "node-reset-data",
    client: { resetNodeData },
    controlClient: {},
    emit,
    args: ["elera-1"],
    config: {},
    dependencies: {},
    environment: {},
    argv: ["node-reset-data", "elera-1", "--confirm=RESET elera-1"],
    parsed: { options: { confirm: "RESET elera-1" } },
  });
  expect(result).toBe(0);
  expect(resetNodeData).toHaveBeenCalledWith(
    "elera-1",
    expect.objectContaining({ confirm: "RESET elera-1" }),
  );
});
