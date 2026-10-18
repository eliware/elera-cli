import { expect, test } from "@jest/globals";
import { runBackupRestoreCommand } from "../../../../src/cli/handlers/backup/restore.mjs";

test("exports backup and restore command dispatch", () => {
  expect(runBackupRestoreCommand).toEqual(expect.any(Function));
});
