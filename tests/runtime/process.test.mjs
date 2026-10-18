import { expect, test } from "@jest/globals";
import * as subject from "../../src/runtime/process.mjs";
import "../../test-fixtures/integration/effectful/runtime/process.test.mjs";
test("exports the matching source module", () =>
  expect(Object.keys(subject).length).toBeGreaterThan(0));
