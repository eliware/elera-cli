import { parseArguments, helpPaths } from '../../src/cli/parser.mjs';

test('parses hierarchical commands and common flags', () => {
  const parsed = parseArguments(['cluster', 'join', 'elera-1', '--confirm', '--json', '--operation-id=op-1']);
  expect(parsed).toMatchObject({ path: ['cluster', 'join'], command: 'cluster-join', positional: ['elera-1'], options: { 'operation-id': 'op-1' } });
  expect(parsed.flags.has('--confirm')).toBe(true);
});

test('supports family and command help', () => {
  expect(parseArguments(['routing', '--help']).help).toBe(true);
  expect(parseArguments(['recovery', 'plan', '--help']).command).toBe('cold-recovery-plan');
  expect(parseArguments(['recovery', 'bootstrap', '{"epoch":"e","winner":"elera-0"}']).command).toBe('cold-recovery-bootstrap');
  expect(helpPaths(['cluster'])).toContain('join');
});

test('rejects unknown or incomplete command paths', () => {
  expect(parseArguments(['not-a-command']).command).toBeUndefined();
  expect(parseArguments(['routing', 'missing']).command).toBeUndefined();
  expect(parseArguments(['not-a-command', 'value']).command).toBeUndefined();
});

test('normalizes separated and inline value options', () => {
  const parsed = parseArguments(['routing', 'bundle', '--operation-id', 'op-1', '--target-endpoint=http://node']);
  expect(parsed.options).toEqual({ 'operation-id': 'op-1', 'target-endpoint': 'http://node' });
  expect(parsed.argv).toContain('--operation-id=op-1');
  expect(parsed.argv).toContain('--target-endpoint=http://node');
});

test('parses verbose output as a common flag', () => {
  expect(parseArguments(['health', 'status', '--verbose']).flags.has('--verbose')).toBe(true);
});

test('rejects unknown options with a useful suggestion', () => {
  const parsed = parseArguments(['health', 'status', '--jso']);
  expect(parsed.errors).toEqual(['unknown option: --jso; did you mean --json?']);
});

test('rejects unknown options without guessing', () => {
  const parsed = parseArguments(['health', 'status', '--mystery']);
  expect(parsed.errors).toEqual(['unknown option: --mystery']);
});

test('accepts command-specific value options in separated and inline forms', () => {
  expect(parseArguments(['cluster', 'plan', '--action', 'rebalance']).options).toEqual({ action: 'rebalance' });
  expect(parseArguments(['cluster', 'plan', '--action=drain']).options).toEqual({ action: 'drain' });
});

test('rejects missing values for command-specific options', () => {
  expect(parseArguments(['cluster', 'plan', '--action']).errors).toEqual(['option requires a value: --action']);
  expect(parseArguments(['cluster', 'plan', '--action=']).errors).toEqual(['option requires a value: --action']);
});

test('validates declared positional requirements', () => {
  expect(parseArguments(['telemetry', 'detail']).errors).toEqual(['telemetry-detail requires a application']);
});

test('scaffolds Core Flow command paths with generic parsing and safety flags', () => {
  expect(parseArguments(['app', 'status', '--json']).command).toBe('app-status');
  expect(parseArguments(['app-admin', 'create', 'Basement']).positional).toEqual(['Basement']);
  expect(parseArguments(['migrate', 'explain', '--help']).help).toBe(true);
  const deletion = parseArguments(['database', 'delete', 'primary', '--dry-run']);
  expect(deletion.command).toBe('database-delete');
  expect(deletion.flags.has('--dry-run')).toBe(true);
});
