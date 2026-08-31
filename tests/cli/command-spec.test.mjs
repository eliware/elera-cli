import { commandTree, helpFor, resolveCommand } from '../../src/cli/command-tree.mjs';
import { commandNames, requirementFor, commonFlags, directedCommands, mutatingCommands, confirmationCommands } from '../../src/cli/command-spec.mjs';

test('command tree exposes every supported family and canonical path', () => {
  const tree = commandTree();
  expect(Object.keys(tree)).toEqual(expect.arrayContaining(['cluster', 'routing', 'backup', 'restore', 'telemetry']));
  expect(Object.keys(tree)).toEqual(expect.arrayContaining(['credentials', 'node']));
  expect(resolveCommand(['cluster', 'join'])).toBe('cluster-join');
  expect(resolveCommand(['routing', 'bundle'])).toBe('bundle');
  expect(resolveCommand(['unknown', 'status'])).toBeUndefined();
  expect(resolveCommand(['credentials', 'create'])).toBe('account-create');
  expect(resolveCommand(['node', 'shutdown'])).toBe('stop');
  expect(helpFor()).toEqual(expect.arrayContaining(['cluster', 'health', 'routing']));
  expect(helpFor(['cluster'])).toEqual(expect.arrayContaining(['bootstrap', 'join', 'status']));
  expect(helpFor(['missing'])).toEqual([]);
  expect(commandNames()).toContain('cluster-join');
});

test('command policy defines common flags, targeting, mutation, confirmation, and requirements', () => {
  expect(commonFlags).toEqual(expect.arrayContaining(['confirm', 'dry-run', 'json', 'target', 'operation-id']));
  expect(directedCommands.has('cluster-join')).toBe(true);
  expect(mutatingCommands.has('database-create')).toBe(true);
  expect(confirmationCommands.has('cluster-bootstrap')).toBe(true);
  expect(confirmationCommands.has('cluster-rejoin')).toBe(true);
  expect(requirementFor('backup')).toEqual({ positional: 1, label: 'backup path' });
  expect(requirementFor('account-create')).toEqual({ positional: 2, label: 'user and database' });
  expect(requirementFor('token-create')).toEqual({ positional: 3, label: 'token, application, and identity' });
  expect(requirementFor('health')).toBeUndefined();
  expect(mutatingCommands.has('database-delete')).toBe(true);
  expect(confirmationCommands.has('database-delete')).toBe(true);
});
