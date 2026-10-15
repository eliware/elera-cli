import * as subject from "../../src/cli/early-exit.mjs";
test("exports early-exit handling", () => expect(Object.keys(subject).length).toBeGreaterThan(0));

test("builds parsed state from the default parser", () => {
  const output = { write() {} };
  expect(subject.handleEarlyExit({ argv: [], emit() {}, output, errorOutput: output })).toBe(0);
});
