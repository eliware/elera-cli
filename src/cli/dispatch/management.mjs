export async function dispatchManagement({ command, client, controlClient, emit, args, handlers }) {
  const calls = {
    'initialization-apply': () => handlers.initializationApply({ client, emit }),
    'standalone-init': () => handlers.standaloneInit({ client, emit }),
    'config-apply': () => handlers.configApply({ client, emit }),
    'metadata-init': () => handlers.metadataInitialize({ client: controlClient, emit }),
    'reconcile-plan': () => handlers.reconcile({ client, emit, command, value: args[0] }),
    'reconcile-apply': () => handlers.reconcile({ client, emit, command, value: args[0] }),
    'reconcile-verify': () => handlers.reconcile({ client, emit, command, value: args[0] }),
    'database-create': () => handlers.databaseCreate({ client, emit, application: args[0], database: args[1] }),
    'database-plan': () => handlers.databasePlan({ client, emit, value: args[0] }),
    'database-verify': () => handlers.databaseVerify({ client, emit, value: args[0] }),
    'identity-create': () => handlers.identityCreate({ client, emit, application: args[0], database: args[1], identity: args[2], purpose: args[3], grants: args[4] }),
    'identity-rotate': () => handlers.identityRotate({ client, emit, identity: args[0] }),
    'account-create': () => handlers.accountCreate({ client, emit, user: args[0], database: args[1], host: args[2], grants: args[3] }),
    'account-revoke': () => handlers.accountRevoke({ client, emit, user: args[0], host: args[1] }),
    'account-verify': () => handlers.accountVerify({ client, emit, user: args[0], host: args[1] }),
    'token-create': () => handlers.tokenCreate({ client, emit, tokenName: args[0], application: args[1], identity: args[2], scopes: args[3] }),
    'token-revoke': () => handlers.tokenRevoke({ client, emit, token: args[0] }),
    'token-rotate': () => handlers.tokenRotate({ client, emit, token: args[0] }),
    'recovery-acknowledge': () => handlers.recoveryAcknowledge({ client, emit, reason: args[0] }),
    'recovery-abort': () => handlers.recoveryAbort({ client, emit, reason: args[0] }),
    'routing-rebalance': () => handlers.routingRebalance({ client, emit, application: args[0] }),
  };
  return calls[command] ? calls[command]() : undefined;
}
