import { runCli } from '../../../src/cli/main.mjs';

const stream = () => ({ value: '', write(value) { this.value += value; } });
const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_API_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' };

test('dispatches database plan and verification commands', async () => {
  const client = { planDatabases: async () => ({ ok: true }), verifyDatabases: async () => ({ ok: true }) };
  for (const argv of [['database', 'plan', '{}'], ['database', 'verify', '{}']]) expect(await runCli({ argv: [...argv, '--json'], environment, output: stream(), errorOutput: stream(), dependencies: { createSupervisorClient: () => client } })).toBe(0);
});
