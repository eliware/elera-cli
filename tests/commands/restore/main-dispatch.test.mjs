import { runCli } from '../../../src/cli/main.mjs';

const stream = () => ({ value: '', write(value) { this.value += value; } });
const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_API_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' };

test('dispatches restore planning through the supervisor client', async () => {
  const client = { planRestore: async () => ({ ok: true }) };
  expect(await runCli({ argv: ['restore', 'plan', '{}', '--json'], environment, output: stream(), errorOutput: stream(), dependencies: { createSupervisorClient: () => client } })).toBe(0);
});
