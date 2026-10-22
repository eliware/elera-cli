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

test("preserves the node reset dry-run value during dispatch", async () => {
  const emit = jest.fn();
  const resetNodeData = jest.fn();
  const result = await dispatchPrimaryCommands({
    command: "node-reset-data",
    client: { resetNodeData },
    controlClient: {},
    emit,
    args: ["elera-single.lab.local"],
    config: {},
    dependencies: {},
    environment: {},
    argv: [
      "node-reset-data",
      "elera-single.lab.local",
      "--dry-run=true",
      "--force=true",
      "--disposition=single-member-resync",
      "--confirm=RESET elera-single.lab.local",
    ],
    parsed: {
      options: {
        "dry-run": "true",
        force: "true",
        disposition: "single-member-resync",
        confirm: "RESET elera-single.lab.local",
      },
    },
  });
  expect(result).toBe(0);
  expect(resetNodeData).not.toHaveBeenCalled();
  expect(emit).toHaveBeenCalledWith(expect.objectContaining({ status: "planned", changed: false }));
});
