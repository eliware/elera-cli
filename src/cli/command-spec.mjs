import { commandTree } from './command-tree.mjs';

export const commonFlags = Object.freeze([
  'confirm', 'dry-run', 'json', 'quiet', 'verbose', 'once', 'target', 'operation-id',
]);

export const directedCommands = new Set([
  'standalone-init', 'cold-bootstrap', 'cold-recover', 'cluster-bootstrap',
  'cluster-join', 'cluster-leave', 'cluster-recover', 'recover',
]);

export const mutatingCommands = new Set([
  'cluster-bootstrap', 'cluster-join', 'cluster-leave', 'cluster-recover',
  'cluster-rejoin', 'drain', 'undrain', 'stop', 'metadata-init', 'config-apply',
  'reconcile-apply', 'restore-metadata-apply', 'restore-accounts-apply',
  'restore-artifact', 'database-create', 'identity-create', 'identity-rotate',
  'account-create', 'account-revoke', 'token-create', 'token-revoke', 'token-rotate',
  'secret-put', 'secret-delete', 'secret-materialize', 'backup', 'restore',
  'recovery-acknowledge', 'recovery-abort', 'routing-rebalance',
  'cold-recovery-authorize', 'cold-recovery-bootstrap', 'cold-recovery-complete',
]);

// These are the operations whose confirmation behavior is currently enforced
// by the dispatcher. New command handlers should add their own policy here
// when they become canonical hierarchical commands.
export const confirmationCommands = new Set([
  'cluster-bootstrap', 'cluster-join', 'cluster-leave', 'cluster-recover',
  'cluster-rejoin', 'metadata-init', 'standalone-init', 'cold-bootstrap', 'cold-recover', 'recover', 'token-rotate',
  'recovery-acknowledge', 'recovery-abort', 'routing-rebalance',
  'cold-recovery-authorize', 'cold-recovery-bootstrap', 'cold-recovery-complete',
]);

export const commandRequirements = Object.freeze({
  'telemetry-detail': { positional: 1, label: 'application' },
  connections: { positional: 1, label: 'application' },
  dump: { positional: 1, label: 'file path' },
  restore: { positional: 1, label: 'file path' },
  backup: { positional: 1, label: 'backup path' },
  'verify-backup': { positional: 1, label: 'backup path' },
  'restore-verify': { positional: 1, label: 'backup path' },
  'restore-artifact': { positional: 1, label: 'backup path' },
  'backup-list': { positional: 1, label: 'backup path' },
  'token-rotate': { positional: 1, label: 'token name' },
  'database-create': { positional: 2, label: 'application and database' },
  'identity-create': { positional: 3, label: 'application, database, and identity' },
  'identity-rotate': { positional: 1, label: 'identity' },
  'account-create': { positional: 2, label: 'user and database' },
  'account-revoke': { positional: 1, label: 'user' },
  'account-verify': { positional: 1, label: 'user' },
  'token-create': { positional: 3, label: 'token, application, and identity' },
  'cold-recovery-authorize': { positional: 1, label: 'authorization JSON' },
  'cold-recovery-bootstrap': { positional: 1, label: 'bootstrap JSON' },
  'cold-recovery-complete': { positional: 1, label: 'completion JSON' },
  'token-revoke': { positional: 1, label: 'token' },
  'database-plan': { positional: 1, label: 'desired database JSON' },
  'database-verify': { positional: 1, label: 'desired database JSON' },
  'backup-plan': { positional: 1, label: 'desired backup JSON' },
  'restore-plan': { positional: 1, label: 'desired restore JSON' },
});

const commandSpecificOptions = Object.freeze({
  'cluster-plan': ['action'],
  'reconcile-plan': ['value'],
  'reconcile-apply': ['value'],
  'reconcile-verify': ['value'],
});

export function schemaFor(command) {
  const requirement = commandRequirements[command];
  return Object.freeze({
    positional: requirement?.positional ?? 0,
    label: requirement?.label ?? 'argument',
    options: Object.freeze([...commonFlags, ...(commandSpecificOptions[command] ?? [])]),
  });
}

export function validateArguments(command, positional = []) {
  if (!command) return [];
  const schema = schemaFor(command);
  return positional.length < schema.positional
    ? [`${command} requires a ${schema.label}`]
    : [];
}

export function commandNames() {
  return Object.values(commandTree()).flatMap((family) => Object.values(family));
}

export function requirementFor(command) {
  return commandRequirements[command];
}
