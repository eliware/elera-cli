export async function runMigrationWorkflow({ client, emit, workflow, input }) {
  const result = await workflow(client, input);
  emit({ ok: true, operation: 'migration', data: result });
  return 0;
}

export const migrationWorkflows = Object.freeze({
  database: (client, { application, database }) => client.provisionDatabase(application, database),
  identity: (client, { application, database, identity, purpose, grants }) => client.provisionIdentity({ application, database, identity, purpose, grants }),
  token: (client, { tokenName, application, identity, scopes }) => client.createToken({ tokenName, application, identity, scopes }),
  inspect: (client, desired) => client.reconcilePlan(desired),
  verify: (client, desired) => client.reconcileVerify(desired),
});

export async function runMigrationAction({ client, emit, action, input = {} }) {
  const workflow = migrationWorkflows[action];
  if (!workflow) throw new Error(`unsupported migration action: ${action}`);
  return runMigrationWorkflow({ client, emit, workflow, input });
}

export function runMigrationExplain({ emit }) {
  emit({ ok: true, operation: 'migration-explain', data: { mapping: { database: 'provisionDatabase', identity: 'provisionIdentity', token: 'createToken', inspect: 'reconcilePlan', verify: 'reconcileVerify' }, pending: ['supervisor name lookup contract', 'migration-specific response schemas'] } });
  return 0;
}

export function runMigrationPending({ action }) { throw new Error(`migration action contract pending: ${action}`); }
