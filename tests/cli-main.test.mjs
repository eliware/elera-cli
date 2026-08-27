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
test('dispatches the management, routing, identity, and cluster command families', async () => {
  const originalFetch = globalThis.fetch; const bundle = { database: 'app', identity: 'runtime', credentials: { username: 'u', password: 'p' }, routes: { primary: [{ host: 'db', port: 3306 }] }, expiresAt: '2099-01-01' };
  globalThis.fetch = jest.fn(async () => ({ ok: true, headers: { get: () => 'application/json' }, json: async () => ({ ok: true, status: 'ok', data: bundle }) }));
  const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_API_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' };
  const commands = [['routes', 'app'], ['bundle'], ['routing-resync', 'app'], ['drain'], ['undrain'], ['drain-status'], ['migration-check'], ['metadata-init', '--confirm'], ['metadata-status'], ['metadata-verify'], ['reconcile-plan', '{}'], ['reconcile-apply', '{}'], ['reconcile-verify', '{}'], ['restore-metadata-plan', '{}'], ['restore-metadata-apply', '{}'], ['restore-accounts-plan', '[]'], ['restore-accounts-apply', '[]'], ['restore-accounts-verify', '[]'], ['secret-list'], ['secret-get', 'x'], ['secret-verify', 'x'], ['secret-delete', 'x'], ['database-list'], ['database-create', 'app', 'db'], ['identity-list', 'app'], ['identity-create', 'app', 'db', 'id'], ['identity-rotate', 'id'], ['account-create', 'u', 'db'], ['account-revoke', 'u'], ['account-verify', 'u'], ['token-create', 't', 'app', 'id'], ['token-revoke', 't'], ['cluster-status'], ['cluster-observations'], ['cluster-quorum'], ['cluster-plan', 'drain'], ['cluster-bootstrap', '--confirm'], ['cluster-join', '--confirm'], ['cluster-leave', '--confirm'], ['cluster-recover', '--confirm']];
  for (const argv of commands) expect(await runCli({ argv: [...argv, '--json'], environment, output: stream(), errorOutput: stream() })).toBeLessThanOrEqual(1);
  for (const command of ['dump', 'restore']) { const error = stream(); expect(await runCli({ argv: [command], environment, output: stream(), errorOutput: error })).toBe(2); expect(error.value).toContain('file path'); }
  const artifactError = stream(); expect(await runCli({ argv: ['restore-artifact', 'root'], environment, output: stream(), errorOutput: artifactError })).toBe(2); expect(artifactError.value).toContain('--confirm');
  globalThis.fetch = originalFetch;
});
test('returns failure when migration diagnostics find an unsafe state', async () => {
  const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_API_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' };
  const output = stream();
  await expect(runCli({ argv: ['migration-check', '--json'], environment, output, errorOutput: stream(), dependencies: { migrationDiagnostics: async () => ({ ok: false, checks: {} }) } })).resolves.toBe(1);
  expect(output.value).toContain('"ok":false');
});
test('returns success when migration diagnostics pass', async () => {
  const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_API_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' };
  expect(await runCli({ argv: ['migration-check'], environment, output: stream(), errorOutput: stream(), dependencies: { migrationDiagnostics: async () => ({ ok: true, checks: {} }) } })).toBe(0);
});

test('preflight is an agent-friendly alias for migration diagnostics', async () => {
  const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_API_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' };
  const output = stream(); const diagnose = jest.fn().mockResolvedValue({ ok: true, checks: { httpOnly: true } });
  expect(await runCli({ argv: ['preflight', '--json'], environment, output, errorOutput: stream(), dependencies: { migrationDiagnostics: diagnose } })).toBe(0);
  expect(diagnose).toHaveBeenCalledWith({ endpoint: 'http://supervisor', configPath: undefined });
  expect(output.value).toContain('httpOnly');
});

test('dispatches streaming, backup, artifact, and SQL smoke operations through injected adapters', async () => {
  const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_API_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' };
  const bundle = { database: 'app', credentials: { username: 'u', password: 'p' }, routes: { primary: [{ host: 'db', port: 3306 }] }, expiresAt: '2099-01-01' };
  const client = new Proxy({ lease: async () => bundle, metadataExport: async () => ({ data: {} }), exportAccounts: async () => ({ accounts: [] }) }, { get: (target, name) => target[name] ?? (async () => ({ ok: true, data: {} })) });
  const calls = [];
  const dependencies = {
    createSupervisorClient: () => client,
    dumpDatabase: async () => calls.push('dump'), restoreDatabase: async () => calls.push('restore'),
    createBackupFromBundle: async () => calls.push('backup'), verifyBackupFromBundle: async () => calls.push('verify'), restoreVerifyFromBundle: async () => calls.push('restore-verify'),
    restoreArtifact: async () => calls.push('artifact'), createDbFromBundle: async () => ({ query: async () => [[{ healthy: 1 }]], close: async () => calls.push('close') }), createLiveDb: async ({ createDb: makeDb, fetchBundle }) => { await fetchBundle(); return { db: await makeDb(), close: async () => calls.push('close') }; }
  };
  for (const argv of [['dump', 'file'], ['restore', 'file'], ['backup', 'root'], ['verify-backup', 'root'], ['restore-verify', 'root'], ['restore-artifact', 'root', '--confirm'], ['sql-smoke']]) await expect(runCli({ argv, environment, output: stream(), errorOutput: stream(), dependencies })).resolves.toBe(0);
  expect(calls).toEqual(['dump', 'restore', 'backup', 'verify', 'restore-verify', 'artifact', 'close']);
});

test('covers command defaults, negative results, and operation errors', async () => {
  const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_API_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' };
  const errors = stream();
  const client = new Proxy({
    health: async () => ({ ok: false }), ready: async () => ({ ok: true, status: 'not-ready' }),
    metadataVerify: async () => ({ ok: false }), quorum: async () => ({ data: {} }),
    intent: async () => ({}), metadataExport: async () => ({}), exportAccounts: async () => ({}),
    lease: async () => ({})
  }, { get: (target, name) => target[name] ?? (async () => ({ ok: false })) });
  const dependencies = { createSupervisorClient: () => client, dumpDatabase: async () => { throw new Error('dump failed'); }, createBackupFromBundle: async () => ({ ok: true }), createDbFromBundle: async () => ({ query: async () => [[{ healthy: 0 }]], close: async () => {} }), createLiveDb: async ({ createDb: makeDb, fetchBundle }) => { await fetchBundle(); return { db: await makeDb(), close: async () => {} }; } };
  expect(await runCli({ argv: ['health'], environment, output: stream(), errorOutput: stream(), dependencies })).toBe(1);
  expect(await runCli({ argv: ['ready'], environment, output: stream(), errorOutput: stream(), dependencies })).toBe(1);
  expect(await runCli({ argv: ['metadata-verify'], environment, output: stream(), errorOutput: stream(), dependencies })).toBe(1);
  expect(await runCli({ argv: ['cluster-quorum'], environment, output: stream(), errorOutput: stream(), dependencies })).toBe(1);
  expect(await runCli({ argv: ['cluster-plan'], environment, output: stream(), errorOutput: errors, dependencies })).toBe(2);
  expect(await runCli({ argv: ['dump', 'file'], environment, output: stream(), errorOutput: errors, dependencies })).toBe(4);
  expect(await runCli({ argv: ['sql-smoke'], environment, output: stream(), errorOutput: stream(), dependencies })).toBe(1);
  expect(await runCli({ argv: ['backup', 'root'], environment, output: stream(), errorOutput: stream(), dependencies })).toBe(0);
  for (const command of ['backup', 'verify-backup', 'restore-verify']) expect(await runCli({ argv: [command], environment, output: stream(), errorOutput: stream(), dependencies })).toBe(2);
});

test('collects metadata and accounts only for full backup operations', async () => {
  const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_API_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' };
  const calls = [];
  const client = {
    lease: async () => ({ database: 'app' }),
    metadataExport: async () => { calls.push('metadata'); return { data: { version: 1 } }; },
    exportAccounts: async () => { calls.push('accounts'); return {}; }
  };
  const dependencies = { createSupervisorClient: () => client, createBackupFromBundle: async (args) => { calls.push(args.metadata.accounts.length); return { ok: true }; } };
  expect(await runCli({ argv: ['backup', 'root'], environment, output: stream(), errorOutput: stream(), dependencies })).toBe(0);
  expect(calls).toEqual(['metadata', 'accounts', 0]);
});

test('exercises omitted optional command arguments and default entrypoint options', async () => {
  const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_API_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' };
  const client = new Proxy({ lease: async () => ({}) }, { get: (target, name) => target[name] ?? (async () => ({ ok: true, data: { quorum: true } })) });
  const dependencies = { createSupervisorClient: () => client, createBackupFromBundle: async () => ({}), verifyBackupFromBundle: async () => ({}), restoreVerifyFromBundle: async () => ({}), restoreArtifact: async () => ({}) };
  expect(await runCli({ argv: ['--help'] })).toBe(0);
  for (const argv of [['bundle'], ['reconcile-plan'], ['reconcile-apply'], ['reconcile-verify'], ['restore-metadata-plan'], ['restore-metadata-apply'], ['restore-accounts-plan'], ['restore-accounts-apply'], ['restore-accounts-verify'], ['identity-create', 'app', 'db', 'id'], ['account-create', 'u', 'db'], ['account-revoke', 'u'], ['account-verify', 'u'], ['token-create', 't', 'app', 'id'], ['cluster-quorum']]) {
    expect(await runCli({ argv, environment, output: stream(), errorOutput: stream(), dependencies })).toBeLessThanOrEqual(1);
  }
});

test('returns success for affirmative reconciliation and restore results', async () => {
  const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_API_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' };
  const client = new Proxy({}, { get: () => async () => ({ ok: true }) });
  const dependencies = { createSupervisorClient: () => client };
  for (const argv of [['reconcile-plan', '{}'], ['reconcile-apply', '{}'], ['reconcile-verify', '{}'], ['restore-metadata-plan', '{}'], ['restore-metadata-apply', '{}'], ['restore-accounts-plan', '[]'], ['restore-accounts-apply', '[]'], ['restore-accounts-verify', '[]']]) expect(await runCli({ argv, environment, output: stream(), errorOutput: stream(), dependencies })).toBe(0);
});

test('returns failure for rejected reconciliation and restore results', async () => {
  const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_API_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' };
  const client = new Proxy({}, { get: () => async () => ({ ok: false }) });
  const dependencies = { createSupervisorClient: () => client };
  for (const argv of [['reconcile-plan', '{}'], ['reconcile-apply', '{}'], ['reconcile-verify', '{}'], ['restore-metadata-plan', '{}'], ['restore-metadata-apply', '{}'], ['restore-accounts-plan', '[]'], ['restore-accounts-apply', '[]'], ['restore-accounts-verify', '[]']]) expect(await runCli({ argv, environment, output: stream(), errorOutput: stream(), dependencies })).toBe(1);
});
