import { validateArguments } from "../command/spec.mjs";
import { parseCommandPath } from "./path.mjs";
import { normalizeOptions } from "./options.mjs";

export function parseCommandArguments(argv) {
  const { path, values, command } = parseCommandPath(argv);
  const { normalized, options, errors, flags } = normalizeOptions(values, command);
  const help = normalized.includes("--help") || normalized.includes("-h");
  const positional = normalized.filter((value) => !value.startsWith("--"));
  const parsedFlags = new Set(normalized.filter((value) => flags.has(value)));
  return {
    path,
    command,
    positional,
    flags: parsedFlags,
    options,
    errors: [...errors, ...validateArguments(command, positional)],
    help,
    argv: command ? [command, ...normalized] : argv,
  };
}
