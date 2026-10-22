import { resolveByName } from "../../src/commands/lookup.mjs";
test("resolves friendly names or stable IDs and rejects ambiguity", () => {
  const records = [{ id: "1", name: "Demo" }];
  expect(resolveByName(records, "Demo", "application")).toBe("1");
  expect(resolveByName(records, "1", "application")).toBe("1");
  expect(() => resolveByName(records, "missing", "application")).toThrow("application not found");
  expect(() =>
    resolveByName([...records, { id: "2", name: "Demo" }], "Demo", "application"),
  ).toThrow("application is ambiguous");
});
