import { resolveCommand, helpFor } from "../command/tree.mjs";

export function parseCommandPath(argv) {
  const values = [...argv];
  const path = [];
  while (values.length && !values[0].startsWith("-") && path.length < 2) {
    if (path.length === 1 && helpFor([path[0]]).length === 0) break;
    path.push(values.shift());
    if (path.length === 2) break;
    if (values.length === 0 || values[0].startsWith("-")) break;
  }
  return { path, values, command: resolveCommand(path) };
}

export function commandHelpPaths(path) {
  return helpFor(path);
}
