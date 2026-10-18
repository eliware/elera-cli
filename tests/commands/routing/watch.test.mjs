import { expect, test } from "@jest/globals";
import * as subject from "../../../src/commands/routing/watch.mjs";
import "../../../test-fixtures/integration/effectful/commands/routing/watch.test.mjs";
test("exports the matching source module", () =>
  expect(Object.keys(subject).length).toBeGreaterThan(0));
