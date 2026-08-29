import { expect, jest, test } from '@jest/globals';
import { runCli } from '../src/cli/main.mjs';

const stream = () => { let value = ''; return { write: (chunk) => { value += chunk; }, get value() { return value; } }; };

test('executes cold bootstrap through public HTTP endpoints only', async () => {
  const responses = [
    { ok: true, data: { eligible: true, candidate: { node: 'elera-0', seqno: 7 } } },
    { ok: true, operation: 'cluster.cold-bootstrap' },
    { ok: true, status: 'ok' },
  ];
  const fetchImpl = jest.fn(async () => ({ ok: true, headers: { get: () => 'application/json' }, json: async () => responses.shift() }));
  const jsonRequest = async (...args) => (await fetchImpl(...args)).json();
  const output = stream();
  expect(await runCli({ argv: ['recovery', 'plan', '--confirm', '--operation-id=e2e', '--json'], environment: { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_API_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' }, output, errorOutput: stream(), dependencies: { createSupervisorClient: (config) => ({ coldBootstrapPlan: () => jsonRequest(`${config.endpoint}/api/v1/cluster/cold-bootstrap/plan`), coldBootstrap: (input) => jsonRequest(`${config.endpoint}/api/v1/cluster/cold-bootstrap`, { body: JSON.stringify(input) }), ready: () => jsonRequest(`${config.endpoint}/readyz`) }) } })).toBe(0);
  expect(fetchImpl).toHaveBeenCalledTimes(3);
  expect(JSON.parse(output.value).status).toBe('completed');
});
