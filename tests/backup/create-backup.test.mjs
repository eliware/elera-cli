import { expect, test } from "@jest/globals";
import * as subject from "../../src/backup/create-backup.mjs";
import "../../test-fixtures/integration/effectful/backup/create-backup.test.mjs";
test("exports the matching source module", () =>
  expect(Object.keys(subject).length).toBeGreaterThan(0));
