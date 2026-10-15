import { expect, test } from "@jest/globals";
import { deriveRuntimeOptions } from "../../src/cli/runtime-options.mjs";

test("derives output, operation, endpoint, and target options", () => {
  expect(
    deriveRuntimeOptions({
      argv: ["cluster", "join", "node-1", "--json"],
      command: "cluster-join",
      parsed: { argv: ["cluster", "join", "node-1", "--operation-id=op"], positional: ["node-1"] },
    }),
  ).toEqual({
    commandArgv: ["cluster", "join", "node-1", "--operation-id=op"],
    jsonOutput: true,
    operationId: "op",
    explicitTarget: undefined,
    targetHost: "node-1",
  });
});

test("uses the target option for directed commands", () => {
  expect(
    deriveRuntimeOptions({
      argv: ["cluster", "join", "--target=node-2"],
      command: "cluster-join",
      parsed: {
        argv: ["cluster-join", "--target=node-2"],
        positional: [],
        options: { target: "node-2" },
      },
    }).targetHost,
  ).toBe("node-2");
});
