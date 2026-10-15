export function createManagementAccessCalls(input) {
  const { client, emit, args, options = {}, handlers } = input;
  return {
    "identity-create": () =>
      handlers.identityCreate({
        client,
        emit,
        application: args[0],
        database: args[1],
        identity: args[2],
        purpose: args[3],
        grants: options.grants ?? args[4],
      }),
    "identity-rotate": () => handlers.identityRotate({ client, emit, identity: args[0] }),
    "account-create": () =>
      handlers.accountCreate({
        client,
        emit,
        user: args[0],
        database: args[1],
        host: args[2],
        grants: args[3],
      }),
    "account-revoke": () => handlers.accountRevoke({ client, emit, user: args[0], host: args[1] }),
    "account-verify": () => handlers.accountVerify({ client, emit, user: args[0], host: args[1] }),
    "token-create": () =>
      handlers.tokenCreate({
        client,
        emit,
        tokenName: args[0],
        application: args[1],
        identity: args[2],
        scopes: options.scopes ?? args[3],
      }),
    "token-revoke": () => handlers.tokenRevoke({ client, emit, token: args[0] }),
    "token-rotate": () => handlers.tokenRotate({ client, emit, token: args[0] }),
    "recovery-acknowledge": () => handlers.recoveryAcknowledge({ client, emit, reason: args[0] }),
    "recovery-abort": () => handlers.recoveryAbort({ client, emit, reason: args[0] }),
    "routing-rebalance": () => handlers.routingRebalance({ client, emit, application: args[0] }),
    "cold-recovery-authorize": () =>
      handlers.coldRecoveryAuthorize({ client, emit, input: JSON.parse(args[0] ?? "{}") }),
    "cold-recovery-bootstrap": () =>
      handlers.coldRecoveryBootstrap({ client, emit, input: JSON.parse(args[0] ?? "{}") }),
    "cold-recovery-complete": () =>
      handlers.coldRecoveryComplete({ client, emit, input: JSON.parse(args[0] ?? "{}") }),
  };
}
