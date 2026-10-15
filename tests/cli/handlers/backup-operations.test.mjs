import { expect, test } from "@jest/globals";
import { createBackupRestoreOperations } from "../../../src/cli/handlers/backup-operations.mjs";

test("creates backup and restore operations", () => {
  const operations = createBackupRestoreOperations({ command: "dump", dependencies: {} });
  expect(Object.keys(operations)).toEqual([
    "native",
    "backup",
    "verify",
    "restoreVerify",
    "artifact",
    "metadata",
    "accounts",
  ]);
});
