import { expect, test } from "@jest/globals";
import { encoded } from "../../src/client/encode-path.mjs";
test("encodes path values and handles missing values", () => {
  expect(encoded("a/b")).toBe("a%2Fb");
  expect(encoded()).toBe("");
});
