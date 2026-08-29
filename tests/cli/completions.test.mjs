import { bashCompletionScript } from '../../src/cli/completions.mjs';

test('generates completion entries from the command registry', () => {
  const script = bashCompletionScript();
  expect(script).toContain('complete -F _elera_cli_complete elera-cli');
  expect(script).toContain('routing)');
  expect(script).toContain('bundle');
});
