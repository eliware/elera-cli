import { expect, test } from "@jest/globals";
import { runCli } from "../../src/cli/main.mjs";
import "../../test-fixtures/integration/cli/main-suite.mjs";

test("runs the CLI entry point", () => {
  expect(runCli).toEqual(expect.any(Function));
});
