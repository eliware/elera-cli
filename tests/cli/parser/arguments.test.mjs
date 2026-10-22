import { expect, test } from "@jest/globals";
import { parseCommandArguments } from "../../../src/cli/parser/arguments.mjs";

test("combines command paths, options, and positional validation", () => {
  expect(parseCommandArguments(["telemetry", "detail", "--json"])).toMatchObject({
    command: "telemetry-detail",
    path: ["telemetry", "detail"],
    positional: [],
    flags: new Set(["--json"]),
    errors: ["telemetry-detail requires a application"],
  });
});
