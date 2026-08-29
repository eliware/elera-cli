import { jest } from '@jest/globals';
import { runCli } from '../../../src/cli/main.mjs';
const stream = () => ({ value: '', write(value) { this.value += value; } });
test('dispatches remaining secret commands through the artifact adapter', async () => {
  const materialize = jest.fn();
  const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_API_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' };
  const result = await runCli({ argv: ['secrets', 'materialize', 'ssh', 'printenv'], environment, output: stream(), errorOutput: stream(), dependencies: { createSupervisorClient: () => ({}), age: { encrypt: async () => 'ciphertext' }, materialize } });
  expect(result).toBe(0); expect(materialize).toHaveBeenCalledWith('ssh', 'printenv', []);
});
