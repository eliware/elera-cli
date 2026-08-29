import { suggestCommand, resolveCommand } from '../../src/cli/command-tree.mjs';

test('suggests family and action names from the registry', () => {
  expect(suggestCommand(['rout'])).toBe('routing');
  expect(suggestCommand(['routing', 'bun'])).toBe('routing bundle');
  expect(suggestCommand(['nope'])).toBeUndefined();
  expect(suggestCommand([])).toBe('health');
});

test('exposes credentials and node as first-class command families', () => {
  expect(suggestCommand(['cred'])).toBe('credentials');
  expect(suggestCommand(['node', 'sta'])).toBe('node status');
});

test('rejects flat command names and resolves hierarchical paths', () => {
  expect(resolveCommand(['backup'])).toBeUndefined();
  expect(resolveCommand(['backup', 'create'])).toBe('backup');
});
