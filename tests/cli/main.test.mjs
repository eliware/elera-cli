import { expect, test } from "@jest/globals";
import { runCli } from "../../src/cli/main.mjs";
import packageJson from "../../package.json" with { type: "json" };
import "../../test-fixtures/integration/cli/main-suite.mjs";

test("runs the CLI entry point", () => {
  expect(runCli).toEqual(expect.any(Function));
});

test("prints the package version", async () => {
  const output = {
    value: "",
    write(value) {
      this.value += value;
    },
  };
  await expect(runCli({ argv: ["--version"], output, errorOutput: { write() {} } })).resolves.toBe(
    0,
  );
  expect(output.value).toBe(`${packageJson.version}\n`);
});
