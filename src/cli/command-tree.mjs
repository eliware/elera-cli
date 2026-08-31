const families = {
  health: { status: 'health', ready: 'ready' },
  initialization: { status: 'initialization-status', plan: 'initialization-plan', apply: 'initialization-apply', verify: 'initialization-verify', standalone: 'standalone-init' },
  telemetry: { summary: 'telemetry', detail: 'telemetry-detail', connections: 'connections', watch: 'telemetry-watch' },
  recovery: { status: 'recovery-status', events: 'recovery-events', acknowledge: 'recovery-acknowledge', abort: 'recovery-abort', evidence: 'cold-recovery-evidence', plan: 'cold-recovery-plan', authorize: 'cold-recovery-authorize', bootstrap: 'cold-recovery-bootstrap', complete: 'cold-recovery-complete', apply: 'cold-bootstrap' },
  cluster: { status: 'cluster-status', observations: 'cluster-observations', evidence: 'node-evidence', quorum: 'cluster-quorum', plan: 'cluster-plan', bootstrap: 'cluster-bootstrap', join: 'cluster-join', leave: 'cluster-leave', rejoin: 'cluster-rejoin', recover: 'cluster-recover', 'startup-status': 'node-status' },
  routing: { status: 'assignment-status', routes: 'routes', bundle: 'bundle', 'bundle-version': 'bundle-version', validate: 'routing-validate', events: 'routing-events', rebalance: 'routing-rebalance', watch: 'routing-watch', resync: 'routing-resync', drain: 'drain', 'drain-status': 'drain-status', undrain: 'undrain' },
  lifecycle: { status: 'node-status', 'node-status': 'node-status', drain: 'drain', 'drain-status': 'drain-status', undrain: 'undrain', stop: 'stop', 'shutdown-status': 'drain-status' },
  configuration: { inspect: 'config-inspect', plan: 'config-plan', apply: 'config-apply', verify: 'config-verify' },
  metadata: { status: 'metadata-status', initialize: 'metadata-init', verify: 'metadata-verify', 'reconcile-plan': 'reconcile-plan', 'reconcile-apply': 'reconcile-apply', 'reconcile-verify': 'reconcile-verify' },
  database: { list: 'database-list', create: 'database-create', delete: 'database-delete', plan: 'database-plan', verify: 'database-verify' },
  identity: { list: 'identity-list', create: 'identity-create', rotate: 'identity-rotate' },
  account: { list: 'account-list', create: 'account-create', revoke: 'account-revoke', verify: 'account-verify' },
  token: { list: 'token-list', create: 'token-create', revoke: 'token-revoke', rotate: 'token-rotate' },
  app: { status: 'app-status', create: 'app-create' },
  'app-admin': { create: 'app-admin-create' },
  migrate: { explain: 'migration-explain', inspect: 'migration-inspect', database: 'migration-database-create', identity: 'migration-identity-create', token: 'migration-token-create', verify: 'migration-verify' },
  credentials: { list: 'account-list', create: 'account-create', revoke: 'account-revoke', rotate: 'token-rotate' },
  node: { status: 'node-status', drain: 'drain', 'drain-status': 'drain-status', undrain: 'undrain', shutdown: 'stop', recover: 'recover', 'reset-data': 'node-reset-data', resync: 'node-resync' },
  secrets: { list: 'secret-list', get: 'secret-get', put: 'secret-put', verify: 'secret-verify', delete: 'secret-delete', materialize: 'secret-materialize' },
  backup: { create: 'backup', dump: 'dump', verify: 'verify-backup', list: 'backup-list', plan: 'backup-plan' },
  restore: { plan: 'restore-plan', apply: 'restore', verify: 'restore-verify', artifact: 'restore-artifact', 'metadata-plan': 'restore-metadata-plan', 'metadata-apply': 'restore-metadata-apply', 'accounts-plan': 'restore-accounts-plan', 'accounts-apply': 'restore-accounts-apply', 'accounts-verify': 'restore-accounts-verify' },
  diagnostics: { migration: 'migration-check', inspect: 'config-inspect' },
  smoke: { sql: 'sql-smoke' },
};
export function commandTree() { return families; }

export function resolveCommand(path) {
  if (!Array.isArray(path) || path.length === 0) return undefined;
  if (path.length === 1) return families[path[0]]?.summary;
  if (path.length !== 2) return undefined;
  const [family, action] = path;
  return families[family]?.[action];
}

export function helpFor(path = []) {
  if (path.length === 0) return Object.keys(families).sort();
  return Object.keys(families[path[0]] ?? {}).sort();
}

export function suggestCommand(path = []) {
  const candidate = path.length > 1
    ? helpFor([path[0]]).find((action) => action.startsWith(path[1]))
    : Object.keys(families).find((family) => family.startsWith(path[0] ?? ''));
  return candidate ? (path.length > 1 ? `${path[0]} ${candidate}` : candidate) : undefined;
}
