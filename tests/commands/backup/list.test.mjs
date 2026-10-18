import { expect, test } from "@jest/globals";
import * as subject from "../../../src/commands/backup/list.mjs";
import "../../../test-fixtures/integration/effectful/commands/backup/list.test.mjs";
test("exports the matching source module", () =>
  expect(Object.keys(subject).length).toBeGreaterThan(0));
