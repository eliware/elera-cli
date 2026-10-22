import { expect, test } from "@jest/globals";
import { lifecycleStatusDone } from "../../../src/commands/lifecycle/status-done.mjs";
test("recognizes completed lifecycle states", () => {
  expect(lifecycleStatusDone({ lifecycle: "stopped" })).toBe(true);
  expect(lifecycleStatusDone({ lifecycle: "draining", drained: true, active: 0 })).toBe(false);
  expect(lifecycleStatusDone({ drained: true, active: 1 })).toBe(false);
});
