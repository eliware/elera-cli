import { confirmationCommands, directedCommands, mutatingCommands } from "./command-policy.mjs";

export function isDirectedCommand(command) {
  return directedCommands.has(command);
}

const hasFlag = (argv, name) =>
  argv.some((value) => value === name || value.startsWith(`${name}=`));

export function shouldPlan({ command, argv }) {
  return (
    mutatingCommands.has(command) && hasFlag(argv, "--dry-run") && command !== "node-reset-data"
  );
}

export function requiresConfirmation({ command, argv }) {
  return (
    confirmationCommands.has(command) && !hasFlag(argv, "--confirm") && !hasFlag(argv, "--dry-run")
  );
}
