export const migrationWorkflows = Object.freeze({
  database: (client, { application, database }) => client.provisionDatabase(application, database),
  identity: (client, { application, database, identity, purpose, grants }) => client.provisionIdentity({ application, database, identity, purpose, grants }),
  token: (client, { tokenName, application, identity, scopes }) => client.createToken({ tokenName, application, identity, scopes }),
  inspect: (client, desired) => client.reconcilePlan(desired),
  verify: (client, desired) => client.reconcileVerify(desired),
});
