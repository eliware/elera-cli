import { expect, test } from "@jest/globals";
import * as subject from "../../src/backup/rotation.mjs";
import "../../test-fixtures/integration/effectful/backup/rotation.test.mjs";
test("exports the matching source module", () =>
  expect(Object.keys(subject).length).toBeGreaterThan(0));
