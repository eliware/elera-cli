import "../../test-fixtures/integration/transport/nas.coverage.mjs";
import * as subject from "../../src/transport/nas.mjs";
test("exports NAS transport operations", () =>
  expect(Object.keys(subject).length).toBeGreaterThan(0));
