import { expect, test } from "@jest/globals";
import * as subject from "../../src/restore/artifact-restore.mjs";
import "../../test-fixtures/integration/effectful/restore/artifact-restore.test.mjs";
test("exports the matching source module", () =>
  expect(Object.keys(subject).length).toBeGreaterThan(0));
