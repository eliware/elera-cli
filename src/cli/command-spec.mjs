import { commandTree } from "./command-tree.mjs";
import data from "./command-data.json" with { type: "json" };

export const commonFlags = Object.freeze(data.commonFlags);
export const directedCommands = new Set(data.directedCommands);
export const mutatingCommands = new Set(data.mutatingCommands);
export const confirmationCommands = new Set(data.confirmationCommands);
export const commandRequirements = Object.freeze(data.commandRequirements);
const commandSpecificOptions = data.commandSpecificOptions;

export function schemaFor(command) {
  const requirement = commandRequirements[command];
  return Object.freeze({
    positional: requirement?.positional ?? 0,
    label: requirement?.label ?? "argument",
    options: Object.freeze([...commonFlags, ...(commandSpecificOptions[command] ?? [])]),
  });
}

export function validateArguments(command, positional = []) {
  if (!command) return [];
  const schema = schemaFor(command);
  return positional.length < schema.positional ? [`${command} requires a ${schema.label}`] : [];
}

export function commandNames() {
  return Object.values(commandTree()).flatMap((family) => Object.values(family));
}

export function requirementFor(command) {
  return commandRequirements[command];
}
