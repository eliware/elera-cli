import { jest } from '@jest/globals';
import { runCli } from '../../src/cli/main.mjs';

const stream = () => ({ value: '', write(value) { this.value += value; } });
const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_CLI_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' };

test('dispatches account and token management commands', async () => {
  const emit = jest.fn();
  const client = { accounts: async () => ({ accounts: [] }), tokens: async () => ({ tokens: [] }), rotateToken: async (token) => ({ token }) };
  const dependencies = { createSupervisorClient: () => client };
  for (const argv of [['account', 'list'], ['token', 'list'], ['token', 'rotate', 'app', '--confirm']]) {
    expect(await runCli({ argv: [...argv, '--json'], environment, output: stream(), errorOutput: stream(), dependencies })).toBe(0);
  }
  expect(emit).not.toHaveBeenCalled();
});
