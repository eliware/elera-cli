import { expect, jest, test } from "@jest/globals";
import { runMigrationWorkflow } from "../../../../src/commands/migration/run/workflow.mjs";
test("runs and emits a migration workflow", async () => {
  const emit = jest.fn();
  await expect(
    runMigrationWorkflow({ client: {}, emit, workflow: async () => ({ ok: true }), input: {} }),
  ).resolves.toBe(0);
  expect(emit).toHaveBeenCalledWith(expect.objectContaining({ operation: "migration" }));
});
