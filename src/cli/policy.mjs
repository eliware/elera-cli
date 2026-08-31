import { confirmationCommands, directedCommands, mutatingCommands } from './command-policy.mjs';

export function isDirectedCommand(command) {
  return directedCommands.has(command);
}

export function shouldPlan({ command, argv }) {
  return mutatingCommands.has(command) && argv.includes('--dry-run') && command !== 'node-reset-data';
}

export function requiresConfirmation({ command, argv }) {
  return confirmationCommands.has(command) && !argv.includes('--confirm') && !argv.includes('--dry-run');
}
