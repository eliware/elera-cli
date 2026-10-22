export function createManagementResourceCalls(input) {
  const { command, client, controlClient, emit, args, options = {}, operationId, handlers } = input;
  return {
    "initialization-apply": () => handlers.initializationApply({ client, emit }),
    "standalone-init": () => handlers.standaloneInit({ client, emit }),
    "config-apply": () => handlers.configApply({ client, emit }),
    "metadata-init": () => handlers.metadataInitialize({ client: controlClient, emit }),
    "reconcile-plan": () => handlers.reconcile({ client, emit, command, value: args[0] }),
    "reconcile-apply": () => handlers.reconcile({ client, emit, command, value: args[0] }),
    "reconcile-verify": () => handlers.reconcile({ client, emit, command, value: args[0] }),
    "database-create": () =>
      handlers.databaseCreate({ client, emit, application: args[0], database: args[1] }),
    "database-delete": () =>
      handlers.databaseDelete({
        client,
        emit,
        databaseId: args[0],
        confirm: options.confirm === true,
        dryRun: options["dry-run"] === true,
        idempotencyKey: operationId,
      }),
    "app-create": () => handlers.applicationCreate({ client, emit, name: args[0] }),
    "app-status": () => handlers.applicationStatus({ client, emit, applicationId: args[0] }),
    "app-admin-create": () =>
      handlers.appAdminCreate({ client, emit, application: args[0], tokenName: args[1] }),
    "migration-explain": () => handlers.migrationExplain({ emit }),
    "migration-inspect": () =>
      handlers.migrationAction({ client, emit, action: "inspect", input: JSON.parse(args[0]) }),
    "migration-database-create": () =>
      handlers.migrationAction({
        client,
        emit,
        action: "database",
        input: { application: args[0], database: args[1] },
      }),
    "migration-identity-create": () =>
      handlers.migrationAction({
        client,
        emit,
        action: "identity",
        input: {
          application: args[0],
          database: args[1],
          identity: args[2],
          purpose: options.purpose ?? "runtime",
          grants: (options.grants ?? "SELECT").split(",").map((grant) => grant.trim()),
        },
      }),
    "migration-token-create": () =>
      handlers.migrationAction({
        client,
        emit,
        action: "token",
        input: {
          tokenName: args[0],
          application: args[1],
          identity: args[2],
          scopes: (options.scopes ?? "credential:issue").split(","),
        },
      }),
    "migration-verify": () =>
      handlers.migrationAction({ client, emit, action: "verify", input: JSON.parse(args[0]) }),
    "database-plan": () => handlers.databasePlan({ client, emit, value: args[0] }),
    "database-verify": () => handlers.databaseVerify({ client, emit, value: args[0] }),
    "node-reset-data": () =>
      handlers.nodeResetData({
        client,
        emit,
        node: args[0],
        confirm: options.confirm,
        force: options.force === "true" || options.force === true,
        disposition: options.disposition,
        idempotencyKey: operationId,
        dryRun: options["dry-run"] === "true" || options["dry-run"] === true,
      }),
    "node-resync": () =>
      handlers.nodeResync({
        client,
        emit,
        node: args[0],
        confirm: options.confirm,
        force: options.force === "true" || options.force === true,
        idempotencyKey: operationId,
        dryRun: options["dry-run"] === "true" || options["dry-run"] === true,
      }),
  };
}
