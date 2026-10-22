import { expect, test } from "@jest/globals";
import { normalizeOptions } from "../../../src/cli/parser/options.mjs";

test("normalizes common and command value options", () => {
  expect(normalizeOptions(["--json", "--action", "drain"], "cluster-plan")).toMatchObject({
    normalized: ["--json", "--action=drain"],
    options: { action: "drain" },
    errors: [],
  });
});

test("reports unknown options and missing values", () => {
  expect(normalizeOptions(["--jso", "--action="], "cluster-plan").errors).toEqual([
    "unknown option: --jso. Did you mean --json?",
    "option requires a value: --action",
  ]);
});
