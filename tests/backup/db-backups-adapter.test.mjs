import { expect, test } from "@jest/globals";
import * as subject from "../../src/backup/db-backups-adapter.mjs";
import "../../test-fixtures/integration/effectful/backup/db-backups-adapter.test.mjs";
test("exports the matching source module", () =>
  expect(Object.keys(subject).length).toBeGreaterThan(0));
