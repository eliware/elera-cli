import "../test-fixtures/integration/exports.mjs";
import * as subject from "../src/index.mjs";
test("exposes the CLI package contract without client internals", async () => {
  expect(subject.createDb).toBeUndefined();
  expect(subject.createDbFromBundle).toBeUndefined();
});
