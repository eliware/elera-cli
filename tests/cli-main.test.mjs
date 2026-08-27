import { jest } from '@jest/globals';
import { runCli } from '../src/cli/main.mjs';

const stream = () => ({ value: '', write(value) { this.value += value; } });

test('prints help and version without requiring configuration', async () => {
  const help = stream(); expect(await runCli({ argv: ['--help'], output: help, errorOutput: stream() })).toBe(0); expect(help.value).toContain('elera-cli');
  const version = stream(); expect(await runCli({ argv: ['--version'], output: version, errorOutput: stream() })).toBe(0); expect(version.value).toBe('0.1.0\n');
});
test('requires explicit confirmation for metadata initialization', async () => { const error = stream(); expect(await runCli({ argv: ['metadata-init'], environment: {}, output: stream(), errorOutput: error })).toBe(2); expect(error.value).toContain('--confirm'); });

test('returns stable invalid-command exit code and writes an actionable error', async () => {
  const error = stream(); expect(await runCli({ argv: ['nope'], environment: {}, output: stream(), errorOutput: error })).toBe(2); expect(error.value).toContain('unknown command');
});

test('executes health, ready, and status commands with JSON output', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = jest.fn(async (url) => ({ ok: true, headers: { get: () => 'application/json' }, json: async () => ({ ok: true, status: 'ok', url }) }));
  const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_API_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' };
  for (const command of ['health', 'ready', 'status']) { const output = stream(); expect(await runCli({ argv: [command, '--json'], environment, output, errorOutput: stream() })).toBe(0); expect(JSON.parse(output.value).ok).toBe(true); }
  globalThis.fetch = originalFetch;
});

test('maps configuration and supervisor failures to stable exit codes', async () => {
  const error = stream();
  expect(await runCli({ argv: ['health'], environment: {}, output: stream(), errorOutput: error })).toBe(4);
  const originalFetch = globalThis.fetch;
  globalThis.fetch = jest.fn(async () => ({ ok: false, status: 401, headers: { get: () => 'application/json' }, json: async () => ({ error: 'denied' }) }));
  const authError = stream();
  const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_API_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' };
  expect(await runCli({ argv: ['health'], environment, output: stream(), errorOutput: authError })).toBe(3);
  globalThis.fetch = originalFetch;
});

test('returns failure for unhealthy and not-ready responses', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = jest.fn(async () => ({ ok: true, headers: { get: () => 'application/json' }, json: async () => ({ ok: false, status: 'not_ready' }) }));
  const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_API_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' };
  expect(await runCli({ argv: ['health'], environment, output: stream(), errorOutput: stream() })).toBe(1);
  expect(await runCli({ argv: ['ready'], environment, output: stream(), errorOutput: stream() })).toBe(1);
  globalThis.fetch = originalFetch;
});

test('executes intent inspection, plan, apply, and verify commands', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = jest.fn(async (url, options = {}) => ({ ok: true, headers: { get: () => 'application/json' }, json: async () => url.endsWith('/config/intent') ? { ok: true, data: { intent: { apiVersion: 'elera.eliware.dev/v1alpha1', kind: 'SupervisorIntent' }, desiredHash: 'hash' } } : { ok: true, data: { change: 'no-op' } } }));
  const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_API_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' };
  for (const command of ['config-inspect', 'config-plan', 'config-apply', 'config-verify']) { const output = stream(); expect(await runCli({ argv: [command, '--json'], environment, output, errorOutput: stream() })).toBe(0); }
  globalThis.fetch = originalFetch;
});
