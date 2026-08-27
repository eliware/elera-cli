import { runCli } from '../src/cli/main.mjs';

const setup = (args) => {
  const output = { text: '', errors: '' };
  return { args, output, streams: { output: { write: value => { output.text += value; } }, errorOutput: { write: value => { output.errors += value; } } } };
};

test('requires explicit confirmation for lifecycle mutations', async () => {
  const context = setup(['cluster-bootstrap']);
  expect(await runCli({ argv: context.args, ...context.streams })).toBe(2);
  expect(context.output.errors).toContain('--confirm');
});

test('dispatches explicit lifecycle commands to the supervisor', async () => {
  const context = setup(['cluster-join', 'node-a', '--confirm', '--json']);
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => ({ ok: true, headers: { get: () => 'application/json' }, json: async () => ({ ok: true, operation: url, request: JSON.parse(options.body) }) });
  try {
    const code = await runCli({ argv: context.args, environment: { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_API_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' }, ...context.streams });
    expect(code).toBe(0);
    expect(JSON.parse(context.output.text).request).toMatchObject({ action: 'join', target: 'node-a', confirm: true });
  } finally { globalThis.fetch = originalFetch; }
});
