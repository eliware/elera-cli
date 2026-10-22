import { parseCommandArguments } from "./parser/arguments.mjs";
import { commandHelpPaths } from "./parser/path.mjs";

export function parseArguments(argv = []) {
  return parseCommandArguments(argv);
}

export function helpPaths(path = []) {
  return commandHelpPaths(path);
}
