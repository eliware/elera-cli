import { expect, test } from "@jest/globals";
import { commandHelpPaths, parseCommandPath } from "../../../src/cli/parser/path.mjs";

test("resolves command paths and keeps remaining values", () => {
  expect(parseCommandPath(["cluster", "join", "node-1"])).toMatchObject({
    path: ["cluster", "join"],
    values: ["node-1"],
    command: "cluster-join",
  });
});

test("stops paths at options and returns help paths", () => {
  expect(parseCommandPath(["routing", "--help"]).values).toEqual(["--help"]);
  expect(commandHelpPaths(["cluster"])).toContain("join");
});
