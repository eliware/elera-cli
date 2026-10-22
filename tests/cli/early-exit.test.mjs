import * as subject from "../../src/cli/early-exit.mjs";
import packageJson from "../../package.json" with { type: "json" };
test("exports early-exit handling", () => expect(Object.keys(subject).length).toBeGreaterThan(0));

test("builds parsed state from the default parser", () => {
  const output = { write() {} };
  expect(subject.handleEarlyExit({ argv: [], emit() {}, output, errorOutput: output })).toBe(0);
});

test("prints help and the package version without configuration", () => {
  const output = {
    value: "",
    write(value) {
      this.value += value;
    },
  };
  const errorOutput = { write() {} };
  expect(
    subject.handleEarlyExit({
      argv: ["--help"],
      emit: (value) => output.write(value),
      output,
      errorOutput,
    }),
  ).toBe(0);
  expect(output.value).toContain("elera-cli");
  output.value = "";
  expect(subject.handleEarlyExit({ argv: ["--version"], emit() {}, output, errorOutput })).toBe(0);
  expect(output.value).toBe(`${packageJson.version}\n`);
});
