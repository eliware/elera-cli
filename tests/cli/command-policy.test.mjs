import { expect, test } from "@jest/globals";
import {
  commonFlags,
  confirmationCommands,
  directedCommands,
  mutatingCommands,
} from "../../src/cli/command-policy.mjs";
test("defines command policy registries", () => {
  expect(commonFlags).toContain("confirm");
  expect(directedCommands.has("cluster-join")).toBe(true);
  expect(mutatingCommands.has("database-create")).toBe(true);
  expect(confirmationCommands.has("database-delete")).toBe(true);
});
