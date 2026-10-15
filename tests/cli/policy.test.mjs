import { expect, test } from "@jest/globals";
import { isDirectedCommand, requiresConfirmation, shouldPlan } from "../../src/cli/policy.mjs";

test("classifies command execution policy", () => {
  expect(isDirectedCommand("cluster-join")).toBe(true);
  expect(shouldPlan({ command: "database-create", argv: ["database-create", "--dry-run"] })).toBe(
    true,
  );
  expect(requiresConfirmation({ command: "database-delete", argv: ["database-delete"] })).toBe(
    true,
  );
  expect(
    requiresConfirmation({ command: "database-delete", argv: ["database-delete", "--dry-run"] }),
  ).toBe(false);
});
