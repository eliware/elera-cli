import { jest } from '@jest/globals';
import { runCli } from '../../src/cli/main.mjs';

const stream = () => ({ value: '', write(value) { this.value += value; } });

test('prints help and version without requiring configuration', async () => {
  const help = stream(); expect(await runCli({ argv: ['--help'], output: help, errorOutput: stream() })).toBe(0); expect(help.value).toContain('elera-cli');
  const version = stream(); expect(await runCli({ argv: ['--version'], output: version, errorOutput: stream() })).toBe(0); expect(version.value).toBe('0.1.0\n');
});
test('prints root help for an empty invocation and family help for a nested path', async () => {
  const empty = stream();
  expect(await runCli({ argv: [], output: empty, errorOutput: stream() })).toBe(0);
  expect(empty.value).toContain('elera-cli --help');
  const family = stream();
  expect(await runCli({ argv: ['cluster', '--help'], output: family, errorOutput: stream() })).toBe(0);
  expect(family.value).toContain('cluster');
  const command = stream();
  expect(await runCli({ argv: ['cluster', 'join', '--help', '--json'], output: command, errorOutput: stream() })).toBe(0);
  expect(JSON.parse(command.value).commands).toContain('join');
});
test('maps supervisor authorization failures to the auth exit code', async () => {
  const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_CLI_TOKEN: 'app-admin-token' };
  const client = { health: async () => { throw Object.assign(new Error('forbidden'), { statusCode: 403 }); } };
  expect(await runCli({ argv: ['health', 'status'], environment, output: stream(), errorOutput: stream(), dependencies: { createSupervisorClient: () => client } })).toBe(3);
});
test('requires explicit confirmation for metadata initialization', async () => { const error = stream(); expect(await runCli({ argv: ['metadata', 'initialize'], environment: {}, output: stream(), errorOutput: error })).toBe(2); expect(error.value).toContain('--confirm'); });
test('requires a backup path for the backup list command', async () => { const error = stream(); const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_CLI_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' }; expect(await runCli({ argv: ['backup', 'list'], environment, output: stream(), errorOutput: error })).toBe(2); expect(error.value).toContain('backup-list requires a backup path'); });
test('rejects commands that are not part of the supported command tree', async () => { const error = stream(); const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_CLI_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' }; expect(await runCli({ argv: ['diagnostics', 'safety'], environment, output: stream(), errorOutput: error, dependencies: { createSupervisorClient: () => ({}) } })).toBe(2); expect(error.value).toContain('unknown command'); });

test('supports process defaults when invoked without an options object', async () => {
  const previous = process.argv;
  process.argv = ['node', 'elera-cli', '--help'];
  try { await expect(runCli()).resolves.toBe(0); } finally { process.argv = previous; }
});
test('rejects a cluster plan without an action', async () => { const error = stream(); const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_CLI_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' }; expect(await runCli({ argv: ['cluster', 'plan'], environment, output: stream(), errorOutput: error })).toBe(2); expect(error.value).toContain('cluster-plan requires an action'); });
test('requires an application for telemetry details', async () => { const error = stream(); expect(await runCli({ argv: ['telemetry', 'detail'], environment: {}, output: stream(), errorOutput: error })).toBe(2); expect(error.value).toContain('application'); });
test('requires an application for connection inspection', async () => { const error = stream(); expect(await runCli({ argv: ['telemetry', 'connections'], environment: {}, output: stream(), errorOutput: error })).toBe(2); expect(error.value).toContain('application'); });
test('requires explicit standalone initialization confirmation', async () => { const error = stream(); expect(await runCli({ argv: ['initialization', 'standalone'], environment: {}, output: stream(), errorOutput: error })).toBe(2); expect(error.value).toContain('--confirm'); });
test('requires API configuration for cold recovery planning', async () => { const error = stream(); expect(await runCli({ argv: ['recovery', 'plan'], environment: {}, output: stream(), errorOutput: error })).toBe(4); });
test('warns and rejects an unconfirmed cold bootstrap', async () => { const error = stream(); expect(await runCli({ argv: ['recovery', 'apply'], environment: {}, output: stream(), errorOutput: error })).toBe(2); expect(error.value).toContain('requires --confirm or --dry-run'); });
test('returns a failure code when cold bootstrap leaves the node unready', async () => { const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_CLI_TOKEN: 'token' }; const client = { coldBootstrapPlan: async () => ({ data: { eligible: true } }), coldBootstrap: async () => ({ ok: true }), ready: async () => ({ ok: false, status: 'not-ready' }) }; expect(await runCli({ argv: ['recovery', 'apply', '--confirm'], environment, output: stream(), errorOutput: stream(), dependencies: { createSupervisorClient: () => client } })).toBe(1); });
test('dispatches cold recovery and routing inspection commands through the public client', async () => { const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_CLI_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' }; const client = { coldRecoveryPlan: jest.fn(async () => ({ data: { eligible: true } })), coldBootstrap: jest.fn(async () => ({ ok: true })), ready: jest.fn(async () => ({ ok: true, status: 'ok' })), coldBootstrapEvidence: jest.fn(async () => ({ ok: true })), routingBundle: jest.fn(async () => ({ database: 'app', bundleVersion: 'v1', writer: { host: 'node' }, failover: [], readers: [] })) }; for (const argv of [['recovery', 'plan', '--dry-run'], ['recovery', 'plan', '--confirm', '--operation-id=op'], ['routing', 'status', 'app'], ['routing', 'status'], ['routing', 'bundle-version'], ['cluster', 'evidence'], ['node', 'drain', '--dry-run']]) { expect(await runCli({ argv: [...argv, '--json'], environment, output: stream(), errorOutput: stream(), dependencies: { createSupervisorClient: () => client } })).toBe(0); } });

test('passes a comma-separated grant policy as one supervisor value', async () => {
  let request;
  const client = { provisionIdentity: async (value) => { request = value; return { ok: true }; } };
  const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_CLI_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' };
  expect(await runCli({ argv: ['identity', 'create', 'app', 'app', 'backup', 'backup', 'SELECT,LOCK TABLES,SHOW VIEW'], environment, output: stream(), errorOutput: stream(), dependencies: { createSupervisorClient: () => client } })).toBe(0);
  expect(request.grants).toEqual(['SELECT', 'LOCK TABLES', 'SHOW VIEW']);
});

test('returns stable invalid-command exit code and writes an actionable error', async () => {
  const error = stream(); expect(await runCli({ argv: ['nope'], environment: {}, output: stream(), errorOutput: error })).toBe(2); expect(error.value).toContain('unknown command');
});

test('supports lifecycle inspection, stop, and explicit recovery confirmation', async () => {
  const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_CLI_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' };
  const originalFetch = globalThis.fetch;
  globalThis.fetch = jest.fn(async (url, options = {}) => {
    const path = new URL(url).pathname;
    const data = path.endsWith('/traffic/status') ? { drained: true, active: 0, lifecycle: 'draining' } : path.endsWith('/cluster/lifecycle/plan') ? { eligible: false, reason: 'quorum required' } : { ready: true, values: { wsrep_cluster_status: 'Primary' } };
    return { ok: true, headers: { get: () => 'application/json' }, json: async () => ({ ok: true, data }) };
  });
  try {
    for (const command of [['node', 'status'], ['node', 'shutdown'], ['node', 'recover'], ['node', 'recover', '--confirm']]) {
      const errorOutput = stream(); const code = await runCli({ argv: [...command, '--json'], environment, output: stream(), errorOutput });
      expect(code).toBe(command[1] === 'recover' && !command.includes('--confirm') ? 2 : command[1] === 'recover' ? 5 : 0);
    }
  } finally { globalThis.fetch = originalFetch; }
});

test('dispatches rejoin through the control client', async () => {
  const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_CLI_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' };
  const client = { rejoin: jest.fn(async () => ({ ok: true, operation: 'cluster.rejoin' })) };
  expect(await runCli({ argv: ['cluster', 'rejoin', 'elera-1', '--confirm', '--json'], environment, output: stream(), errorOutput: stream(), dependencies: { createSupervisorClient: () => client } })).toBe(0);
  expect(client.rejoin).toHaveBeenCalled();
});

test('executes health, ready, status, initialization, and connection commands with JSON output', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = jest.fn(async (url) => ({ ok: true, headers: { get: () => 'application/json' }, json: async () => ({ ok: true, status: 'ok', url, data: { database: 'elera_meta' } }) }));
  const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_CLI_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' };
  for (const argv of [['health', 'status'], ['cluster', 'status'], ['health', 'ready'], ['telemetry', 'summary'], ['initialization', 'status'], ['initialization', 'plan'], ['initialization', 'apply'], ['initialization', 'verify']]) { const output = stream(); expect(await runCli({ argv: [...argv, '--json'], environment, output, errorOutput: stream() })).toBe(0); expect(JSON.parse(output.value).ok).toBe(true); }
  const detail = stream(); expect(await runCli({ argv: ['telemetry', 'detail', 'app', '--json'], environment, output: detail, errorOutput: stream() })).toBe(0);
  const connections = stream(); expect(await runCli({ argv: ['telemetry', 'connections', 'app', '--json'], environment, output: connections, errorOutput: stream() })).toBe(0);
  const standalone = stream(); expect(await runCli({ argv: ['initialization', 'standalone', '--confirm', '--json'], environment, output: standalone, errorOutput: stream() })).toBe(0);
  const dryRun = stream(); expect(await runCli({ argv: ['initialization', 'standalone', '--dry-run', '--json'], environment, output: dryRun, errorOutput: stream() })).toBe(0);
  globalThis.fetch = originalFetch;
});
test('reports initialization and cold-bootstrap refusal without hiding the reason', async () => {
  const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_CLI_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' };
  const client = {
    initializationVerify: async () => ({ ok: false, error: 'not initialized' }),
    coldRecoveryPlan: async () => ({ data: { eligible: false, reason: 'ambiguous seqno' } }),
  };
  expect(await runCli({ argv: ['initialization', 'verify', '--json'], environment, output: stream(), errorOutput: stream(), dependencies: { createSupervisorClient: () => client } })).toBe(1);
  expect(await runCli({ argv: ['recovery', 'plan', '--confirm', '--json'], environment, output: stream(), errorOutput: stream(), dependencies: { createSupervisorClient: () => client } })).toBe(1);
});
test('handles standalone planning responses with the shared data wrapper', async () => {
  const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_CLI_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' };
  const client = { initializationPlan: async () => ({ ok: true, data: { database: 'elera_meta' } }), initializationApply: async () => ({ ok: true }) };
  expect(await runCli({ argv: ['initialization', 'standalone', '--dry-run', '--json'], environment, output: stream(), errorOutput: stream(), dependencies: { createSupervisorClient: () => client } })).toBe(0);
});
test('uses the configured identity when assignment application is omitted', async () => {
  const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_CLI_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' };
  const client = { routingBundle: async identity => ({ database: identity, bundleVersion: 'v1', writer: {}, failover: [], readers: [] }) };
  expect(await runCli({ argv: ['routing', 'status'], environment, output: stream(), errorOutput: stream(), dependencies: { createSupervisorClient: () => client } })).toBe(0);
});

test('maps configuration and supervisor failures to stable exit codes', async () => {
  const error = stream();
  expect(await runCli({ argv: ['health', 'status'], environment: {}, output: stream(), errorOutput: error })).toBe(4);
  const originalFetch = globalThis.fetch;
  globalThis.fetch = jest.fn(async () => ({ ok: false, status: 401, headers: { get: () => 'application/json' }, json: async () => ({ error: 'denied' }) }));
  const authError = stream();
  const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_CLI_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' };
  expect(await runCli({ argv: ['health', 'status'], environment, output: stream(), errorOutput: authError })).toBe(3);
  globalThis.fetch = originalFetch;
});

test('returns failure for unhealthy and not-ready responses', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = jest.fn(async () => ({ ok: true, headers: { get: () => 'application/json' }, json: async () => ({ ok: false, status: 'not_ready' }) }));
  const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_CLI_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' };
  expect(await runCli({ argv: ['health', 'status'], environment, output: stream(), errorOutput: stream() })).toBe(1);
  expect(await runCli({ argv: ['health', 'ready'], environment, output: stream(), errorOutput: stream() })).toBe(1);
  globalThis.fetch = originalFetch;
});

test('executes intent inspection, plan, apply, and verify commands', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = jest.fn(async (url, options = {}) => ({ ok: true, headers: { get: () => 'application/json' }, json: async () => url.endsWith('/config/intent') ? { ok: true, data: { intent: { apiVersion: 'elera.eliware.dev/v1alpha1', kind: 'SupervisorIntent' }, desiredHash: 'hash' } } : { ok: true, data: { change: 'no-op' } } }));
  const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_CLI_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' };
  for (const argv of [['configuration', 'inspect'], ['configuration', 'plan'], ['configuration', 'apply'], ['configuration', 'verify']]) { const output = stream(); expect(await runCli({ argv: [...argv, '--json'], environment, output, errorOutput: stream() })).toBe(0); }
  globalThis.fetch = originalFetch;
});
test('dispatches the management, routing, identity, and cluster command families', async () => {
  const originalFetch = globalThis.fetch; const bundle = { apiVersion: 'v1', application: 'app', database: 'app', identity: 'runtime', nodeIdentity: 'node-1', credentials: { username: 'u', password: 'p' }, bundleVersion: 1, ports: { sql: 3306, http: 8080 }, writer: { host: 'db', port: 3306 }, readers: [{ host: 'db', port: 3306 }], failover: [], routes: { primary: [{ host: 'db', port: 3306 }], balanced: [{ host: 'db', port: 3306 }] }, expiresAt: '2099-01-01' };
  globalThis.fetch = jest.fn(async () => ({ ok: true, headers: { get: () => 'application/json' }, json: async () => ({ ok: true, status: 'ok', data: bundle }) }));
  const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_CLI_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' };
  const commands = [['routing', 'routes', 'app'], ['routing', 'bundle'], ['routing', 'resync', 'app'], ['node', 'drain'], ['node', 'undrain'], ['node', 'drain-status'], ['diagnostics', 'migration'], ['metadata', 'initialize', '--confirm'], ['metadata', 'status'], ['metadata', 'verify'], ['metadata', 'reconcile-plan', '{}'], ['metadata', 'reconcile-apply', '{}'], ['metadata', 'reconcile-verify', '{}'], ['restore', 'metadata-plan', '{}'], ['restore', 'metadata-apply', '{}'], ['restore', 'accounts-plan', '[]'], ['restore', 'accounts-apply', '[]'], ['restore', 'accounts-verify', '[]'], ['secrets', 'list'], ['secrets', 'get', 'x'], ['secrets', 'verify', 'x'], ['secrets', 'delete', 'x'], ['database', 'list'], ['database', 'create', 'app', 'db'], ['identity', 'list', 'app'], ['identity', 'create', 'app', 'db', 'id'], ['identity', 'rotate', 'id'], ['account', 'create', 'u', 'db'], ['account', 'revoke', 'u'], ['account', 'verify', 'u'], ['token', 'create', 't', 'app', 'id'], ['token', 'revoke', 't'], ['cluster', 'status'], ['cluster', 'observations'], ['cluster', 'quorum'], ['cluster', 'plan', 'drain'], ['cluster', 'bootstrap', '--confirm'], ['cluster', 'join', '--confirm'], ['cluster', 'leave', '--confirm'], ['cluster', 'recover', '--confirm']];
  for (const argv of commands) expect(await runCli({ argv: [...argv, '--json'], environment, output: stream(), errorOutput: stream() })).toBeLessThanOrEqual(1);
  for (const argv of [['backup', 'dump'], ['restore', 'apply']]) { const error = stream(); expect(await runCli({ argv, environment, output: stream(), errorOutput: error })).toBe(2); expect(error.value).toContain('file path'); }
  const artifactError = stream(); expect(await runCli({ argv: ['restore', 'artifact', 'root'], environment, output: stream(), errorOutput: artifactError })).toBe(2); expect(artifactError.value).toContain('--confirm');
  globalThis.fetch = originalFetch;
});
test('returns failure when migration diagnostics find an unsafe state', async () => {
  const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_CLI_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' };
  const output = stream();
  await expect(runCli({ argv: ['diagnostics', 'migration', '--json'], environment, output, errorOutput: stream(), dependencies: { migrationDiagnostics: async () => ({ ok: false, checks: {} }) } })).resolves.toBe(1);
  expect(output.value).toContain('"ok":false');
});
test('returns success when migration diagnostics pass', async () => {
  const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_CLI_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' };
  expect(await runCli({ argv: ['diagnostics', 'migration'], environment, output: stream(), errorOutput: stream(), dependencies: { migrationDiagnostics: async () => ({ ok: true, checks: {} }) } })).toBe(0);
});

test('preflight is an agent-friendly alias for migration diagnostics', async () => {
  const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_CLI_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' };
  const output = stream(); const diagnose = jest.fn().mockResolvedValue({ ok: true, checks: { httpOnly: true } });
  expect(await runCli({ argv: ['diagnostics', 'migration', '--json'], environment, output, errorOutput: stream(), dependencies: { migrationDiagnostics: diagnose } })).toBe(0);
  expect(diagnose).toHaveBeenCalledWith({ endpoint: 'http://supervisor', configPath: undefined });
  expect(output.value).toContain('httpOnly');
});

test('dispatches streaming, backup, artifact, and SQL smoke operations through injected adapters', async () => {
  const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_CLI_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' };
  const bundle = { apiVersion: 'v1', application: 'app', database: 'app', identity: 'runtime', nodeIdentity: 'node-1', credentials: { username: 'u', password: 'p' }, bundleVersion: 1, ports: { sql: 3306, http: 8080 }, writer: { host: 'db', port: 3306 }, readers: [{ host: 'db', port: 3306 }], failover: [], routes: { primary: [{ host: 'db', port: 3306 }], balanced: [{ host: 'db', port: 3306 }] }, expiresAt: '2099-01-01' };
  const client = new Proxy({ lease: async () => bundle, metadataExport: async () => ({ data: {} }), exportAccounts: async () => ({ accounts: [] }) }, { get: (target, name) => target[name] ?? (async () => ({ ok: true, data: {} })) });
  const calls = [];
  const dependencies = {
    createSupervisorClient: () => client,
    dumpDatabase: async () => calls.push('dump'), restoreDatabase: async () => calls.push('restore'),
    createBackupFromBundle: async () => calls.push('backup'), verifyBackupFromBundle: async () => calls.push('verify'), restoreVerifyFromBundle: async () => calls.push('restore-verify'),
    restoreArtifact: async () => calls.push('artifact'), createDb: async () => ({ query: async () => [[{ healthy: 1 }]], close: async () => calls.push('close') }), createDbFromBundle: async () => ({ query: async () => [[{ healthy: 1 }]], close: async () => calls.push('close') }), createLiveDb: async ({ createDb: makeDb, fetchBundle }) => { await fetchBundle(); return { db: await makeDb(), close: async () => calls.push('close') }; }
  };
  for (const argv of [['backup', 'dump', 'file'], ['restore', 'apply', 'file'], ['backup', 'create', 'root'], ['backup', 'verify', 'root'], ['restore', 'verify', 'root'], ['restore', 'artifact', 'root', '--confirm'], ['smoke', 'sql']]) await expect(runCli({ argv, environment, output: stream(), errorOutput: stream(), dependencies })).resolves.toBe(0);
  expect(calls).toEqual(['dump', 'restore', 'backup', 'verify', 'restore-verify', 'artifact', 'close']);
});

test('covers command defaults, negative results, and operation errors', async () => {
  const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_CLI_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' };
  const errors = stream();
  const client = new Proxy({
    health: async () => ({ ok: false }), ready: async () => ({ ok: true, status: 'not-ready' }),
    metadataVerify: async () => ({ ok: false }), quorum: async () => ({ data: {} }),
    intent: async () => ({}), metadataExport: async () => ({}), exportAccounts: async () => ({}),
    lease: async () => ({})
  }, { get: (target, name) => target[name] ?? (async () => ({ ok: false })) });
  const dependencies = { createSupervisorClient: () => client, dumpDatabase: async () => { throw new Error('dump failed'); }, createBackupFromBundle: async () => ({ ok: true }), createDb: async () => ({ query: async () => [[{ healthy: 0 }]], close: async () => {} }), createDbFromBundle: async () => ({ query: async () => [[{ healthy: 0 }]], close: async () => {} }), createLiveDb: async ({ createDb: makeDb, fetchBundle }) => { await fetchBundle(); return { db: await makeDb(), close: async () => {} }; } };
  expect(await runCli({ argv: ['health', 'status'], environment, output: stream(), errorOutput: stream(), dependencies })).toBe(1);
  expect(await runCli({ argv: ['health', 'ready'], environment, output: stream(), errorOutput: stream(), dependencies })).toBe(1);
  expect(await runCli({ argv: ['metadata', 'verify'], environment, output: stream(), errorOutput: stream(), dependencies })).toBe(1);
  expect(await runCli({ argv: ['cluster', 'quorum'], environment, output: stream(), errorOutput: stream(), dependencies })).toBe(1);
  expect(await runCli({ argv: ['cluster', 'plan'], environment, output: stream(), errorOutput: errors, dependencies })).toBe(2);
  expect(await runCli({ argv: ['backup', 'dump', 'file'], environment, output: stream(), errorOutput: errors, dependencies })).toBe(4);
  expect(await runCli({ argv: ['smoke', 'sql'], environment, output: stream(), errorOutput: stream(), dependencies })).toBe(1);
  expect(await runCli({ argv: ['backup', 'create', 'root'], environment, output: stream(), errorOutput: stream(), dependencies })).toBe(0);
  for (const argv of [['backup', 'create'], ['backup', 'verify'], ['restore', 'verify']]) expect(await runCli({ argv, environment, output: stream(), errorOutput: stream(), dependencies })).toBe(2);
});

test('collects metadata and accounts only for full backup operations', async () => {
  const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_CLI_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' };
  const calls = [];
  const client = {
    lease: async () => ({ database: 'app' }),
    metadataExport: async () => { calls.push('metadata'); return { data: { version: 1 } }; },
    exportAccounts: async () => { calls.push('accounts'); return {}; }
  };
  const dependencies = { createSupervisorClient: () => client, createBackupFromBundle: async (args) => { calls.push(args.metadata.accounts.length); return { ok: true }; } };
  expect(await runCli({ argv: ['backup', 'create', 'root'], environment, output: stream(), errorOutput: stream(), dependencies })).toBe(0);
  expect(await runCli({ argv: ['backup', 'create', 'root', '--json'], environment, output: stream(), errorOutput: stream(), dependencies })).toBe(0);
  expect(calls).toEqual(['metadata', 'accounts', 0, 'metadata', 'accounts', 0]);
});

test('exercises omitted optional command arguments and default entrypoint options', async () => {
  const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_CLI_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' };
  const client = new Proxy({ lease: async () => ({}) }, { get: (target, name) => target[name] ?? (async () => ({ ok: true, data: { quorum: true } })) });
  const dependencies = { createSupervisorClient: () => client, createBackupFromBundle: async () => ({}), verifyBackupFromBundle: async () => ({}), restoreVerifyFromBundle: async () => ({}), restoreArtifact: async () => ({}) };
  expect(await runCli({ argv: ['--help'] })).toBe(0);
  for (const argv of [['routing', 'bundle'], ['metadata', 'reconcile-plan'], ['metadata', 'reconcile-apply'], ['metadata', 'reconcile-verify'], ['restore', 'metadata-plan'], ['restore', 'metadata-apply'], ['restore', 'accounts-plan'], ['restore', 'accounts-apply'], ['restore', 'accounts-verify'], ['identity', 'create', 'app', 'db', 'id'], ['account', 'create', 'u', 'db'], ['account', 'revoke', 'u'], ['account', 'verify', 'u'], ['token', 'create', 't', 'app', 'id'], ['cluster', 'quorum']]) {
    expect(await runCli({ argv, environment, output: stream(), errorOutput: stream(), dependencies })).toBeLessThanOrEqual(1);
  }
});

test('returns success for affirmative reconciliation and restore results', async () => {
  const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_CLI_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' };
  const client = new Proxy({}, { get: () => async () => ({ ok: true }) });
  const dependencies = { createSupervisorClient: () => client };
  for (const argv of [['metadata', 'reconcile-plan', '{}'], ['metadata', 'reconcile-apply', '{}'], ['metadata', 'reconcile-verify', '{}'], ['restore', 'metadata-plan', '{}'], ['restore', 'metadata-apply', '{}'], ['restore', 'accounts-plan', '[]'], ['restore', 'accounts-apply', '[]'], ['restore', 'accounts-verify', '[]']]) expect(await runCli({ argv, environment, output: stream(), errorOutput: stream(), dependencies })).toBe(0);
});

test('returns failure for rejected reconciliation and restore results', async () => {
  const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_CLI_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' };
  const client = new Proxy({}, { get: () => async () => ({ ok: false }) });
  const dependencies = { createSupervisorClient: () => client };
  for (const argv of [['metadata', 'reconcile-plan', '{}'], ['metadata', 'reconcile-apply', '{}'], ['metadata', 'reconcile-verify', '{}'], ['restore', 'metadata-plan', '{}'], ['restore', 'metadata-apply', '{}'], ['restore', 'accounts-plan', '[]'], ['restore', 'accounts-apply', '[]'], ['restore', 'accounts-verify', '[]']]) expect(await runCli({ argv, environment, output: stream(), errorOutput: stream(), dependencies })).toBe(1);
});

test('returns a usage error for an unknown option', async () => {
  const error = stream();
  expect(await runCli({ argv: ['health', 'status', '--mystery'], output: stream(), errorOutput: error })).toBe(2);
  expect(error.value).toContain('unknown option: --mystery');
});

test('suggests a command-tree match for an unknown action', async () => {
  const error = stream();
  expect(await runCli({ argv: ['routing', 'bun'], output: stream(), errorOutput: error })).toBe(2);
  expect(error.value).toContain('did you mean routing bundle?');
});

test('renders command-level help from the declarative schema', async () => {
  const output = stream();
  expect(await runCli({ argv: ['routing', 'bundle', '--help', '--json'], output, errorOutput: stream() })).toBe(0);
  expect(JSON.parse(output.value)).toMatchObject({ canonical: 'bundle', options: expect.arrayContaining(['json', 'operation-id']) });
});

test('dispatches recovery and routing administration commands', async () => {
  const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_CLI_TOKEN: 'token' };
  const client = new Proxy({}, { get: () => async () => ({ ok: true, data: { routes: { primary: [], balanced: [] } } }) });
  const dependencies = { createSupervisorClient: () => client };
  for (const argv of [['recovery', 'status'], ['recovery', 'events'], ['recovery', 'acknowledge', '--confirm'], ['recovery', 'abort', '--confirm'], ['routing', 'validate'], ['routing', 'events'], ['routing', 'rebalance', '--confirm']]) {
    expect(await runCli({ argv: [...argv, '--json'], environment, output: stream(), errorOutput: stream(), dependencies })).toBe(0);
  }
});

test('supports one-shot routing and telemetry watches', async () => {
  const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_CLI_TOKEN: 'token' };
  const client = { routingBundle: async () => ({ application: 'default', database: 'db', identity: 'id', credentials: { username: 'u', password: 'p' }, routes: { primary: [], balanced: [] }, expiresAt: '2099-01-01' }) };
  for (const command of [['routing', 'watch'], ['telemetry', 'watch']]) expect(await runCli({ argv: [...command, '--once', '--json'], environment, output: stream(), errorOutput: stream(), dependencies: { createSupervisorClient: () => client } })).toBe(0);
});

test('covers entrypoint plan, target, preflight, and recovery branches', async () => {
  const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_CLI_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' };
  const output = stream();
  const fetchImpl = jest.fn(async () => ({ ok: true, headers: { get: () => 'application/json' }, json: async () => ({ ok: true, data: { eligible: true, status: 'ok', routes: { primary: [], balanced: [] } } }) }));
  const client = new Proxy({ coldBootstrap: async () => ({ ok: true }), coldRecoveryPlan: async () => ({ ok: true, data: { eligible: true } }) }, { get: (target, name) => target[name] ?? (async () => ({ ok: true, data: {} })) });
  const dependencies = { createSupervisorClient: () => client, migrationDiagnostics: jest.fn(async () => ({ ok: true })) };
  for (const argv of [['configuration', 'plan'], ['backup', 'plan', '{}'], ['restore', 'plan', '{}'], ['recovery', 'apply', '--dry-run'], ['diagnostics', 'migration']]) {
    await expect(runCli({ argv, environment, output, errorOutput: stream(), dependencies })).resolves.toBeLessThanOrEqual(1);
  }
  await expect(runCli({ argv: ['cluster', 'plan', 'drain'], environment, output: stream(), errorOutput: stream(), dependencies })).resolves.toBeLessThanOrEqual(1);
  expect(fetchImpl).not.toHaveBeenCalled();
});

test('rejects restore artifacts without a path or confirmation', async () => {
  const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_CLI_TOKEN: 'token' };
  const error = stream();
  await expect(runCli({ argv: ['restore', 'artifact'], environment, output: stream(), errorOutput: error })).resolves.toBe(2);
  expect(error.value).toContain('backup path');
});

test('routes the remaining management commands through the entrypoint', async () => {
  const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_CLI_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' };
  const client = new Proxy({ initializationPlan: async () => ({ ok: true, data: { database: 'elera_meta' } }) }, { get: (target, name) => target[name] ?? (async () => ({ ok: true, data: {} })) });
  const dependencies = { createSupervisorClient: () => client };
  const commands = [
    ['initialization', 'apply'], ['initialization', 'standalone'], ['configuration', 'apply'], ['metadata', 'initialize'],
    ['database', 'create', 'app', 'db'], ['database', 'plan', '{}'], ['database', 'verify', '{}'],
    ['identity', 'create', 'app', 'db', 'id'], ['identity', 'rotate', 'id'], ['account', 'create', 'u', 'db'],
    ['account', 'revoke', 'u'], ['account', 'verify', 'u'], ['token', 'create', 't', 'app', 'id'],
    ['token', 'revoke', 't'], ['token', 'rotate', 't'], ['recovery', 'acknowledge', 'ok'],
    ['recovery', 'abort', 'ok'], ['routing', 'rebalance', 'app'], ['recovery', 'authorize', '{}'],
    ['recovery', 'bootstrap', '{}'], ['recovery', 'complete', '{}'],
  ];
  for (const argv of commands) await expect(runCli({ argv: [...argv, '--confirm', '--json'], environment, output: stream(), errorOutput: stream(), dependencies })).resolves.toBeLessThanOrEqual(1);
});

test('routes lifecycle aliases through an injected lifecycle adapter', async () => {
  const environment = { ELERA_API_ENDPOINT: 'http://supervisor', ELERA_CLI_TOKEN: 'token' };
  const lifecycle = new Proxy({ classify: () => 0 }, { get: (target, name) => target[name] ?? (async () => ({ ok: true })) });
  const dependencies = { createSupervisorClient: () => ({}), createLifecycleCommands: jest.fn(() => lifecycle) };
  for (const argv of [['lifecycle', 'status'], ['lifecycle', 'drain'], ['lifecycle', 'drain-status'], ['lifecycle', 'undrain'], ['lifecycle', 'stop'], ['node', 'status'], ['node', 'drain'], ['node', 'drain-status'], ['node', 'undrain'], ['node', 'shutdown'], ['node', 'recover']]) {
    await expect(runCli({ argv: [...argv, '--confirm', '--json'], environment, output: stream(), errorOutput: stream(), dependencies })).resolves.toBe(0);
  }
  expect(dependencies.createLifecycleCommands).toHaveBeenCalled();
});
