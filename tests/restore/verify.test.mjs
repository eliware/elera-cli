import "../../test-fixtures/integration/restore/restore-verify.coverage.mjs";
import * as subject from "../../src/restore/verify.mjs";
test("exports restore verification operations", () =>
  expect(Object.keys(subject).length).toBeGreaterThan(0));
