import { expect, test } from "@jest/globals";
import * as subject from "../../src/backup/hash-file.mjs";
import "../../test-fixtures/integration/effectful/backup/hash-file.test.mjs";
test("exports the matching source module", () =>
  expect(Object.keys(subject).length).toBeGreaterThan(0));
