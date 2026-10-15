import { expect, jest, test } from "@jest/globals";
import { runPreflight } from "../../src/cli/preflight.mjs";

test("requires confirmation for cold bootstrap", () => {
  const errorOutput = { write: jest.fn() };
  expect(runPreflight({ command: "cold-bootstrap", argv: [], emit: jest.fn(), errorOutput })).toBe(
    2,
  );
  expect(errorOutput.write).toHaveBeenCalledWith(
    "cold-bootstrap requires --confirm or --dry-run\n",
  );
});
