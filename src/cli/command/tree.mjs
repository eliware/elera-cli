import families from "../command-families.json" with { type: "json" };

const nativeCommands = ["dump", "sql"];

export function commandTree() {
  return families;
}

export function resolveCommand(path) {
  if (!Array.isArray(path) || path.length === 0) return undefined;
  if (path.length === 1) return families[path[0]]?.summary;
  if (path.length !== 2) return undefined;
  const [family, action] = path;
  return families[family]?.[action];
}

export function helpFor(path = []) {
  if (path.length === 0) return [...Object.keys(families), ...nativeCommands].sort();
  return Object.keys(families[path[0]] ?? {}).sort();
}

export function suggestCommand(path = []) {
  const candidate =
    path.length > 1
      ? helpFor([path[0]]).find((action) => action.startsWith(path[1]))
      : Object.keys(families).find((family) => family.startsWith(path[0] ?? ""));
  return candidate ? (path.length > 1 ? `${path[0]} ${candidate}` : candidate) : undefined;
}
