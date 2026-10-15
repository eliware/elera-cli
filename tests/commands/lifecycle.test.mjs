import "../../test-fixtures/integration/lifecycle-commands.mjs";
import * as subject from "../../src/commands/lifecycle.mjs";
test("exports lifecycle command operations", () =>
  expect(Object.keys(subject).length).toBeGreaterThan(0));
