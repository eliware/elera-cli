import { runInitializationApply } from "../../commands/initialization/apply.mjs";
import { runStandaloneInitialization } from "../../commands/initialization/standalone.mjs";
import { runConfigApply } from "../../commands/configuration/apply.mjs";
import { runMetadataInitialize } from "../../commands/metadata/initialize.mjs";
import { runReconcile } from "../../commands/metadata/reconcile.mjs";
import { runDatabaseCreate } from "../../commands/database/create.mjs";
import { runDatabaseDelete } from "../../commands/database/delete.mjs";
import { runDatabasePlan } from "../../commands/database/plan.mjs";
import { runDatabaseVerify } from "../../commands/database/verify.mjs";
import { runApplicationCreate } from "../../commands/application/create.mjs";
import { runApplicationStatus } from "../../commands/application/status.mjs";
import { runAppAdminCreate } from "../../commands/application/admin-create.mjs";
import { runMigrationExplain } from "../../commands/migration/explain.mjs";
import { runMigrationAction } from "../../commands/migration/run/action.mjs";
import { runNodeResetData } from "../../commands/node/reset-operation.mjs";
import { runNodeResync } from "../../commands/node/resync.mjs";
import { runIdentityCreate } from "../../commands/identity/create.mjs";
import { runIdentityRotate } from "../../commands/identity/rotate.mjs";
import { runAccountCreate } from "../../commands/account/create.mjs";
import { runAccountRevoke } from "../../commands/account/revoke.mjs";
import { runAccountVerify } from "../../commands/account/verify.mjs";
import { runTokenCreate } from "../../commands/access-keys/create.mjs";
import { runTokenRevoke } from "../../commands/access-keys/revoke.mjs";
import { runTokenRotate } from "../../commands/access-keys/rotate.mjs";
import { runRecoveryAcknowledge } from "../../commands/recovery/acknowledge.mjs";
import { runRecoveryAbort } from "../../commands/recovery/abort.mjs";
import { runRoutingRebalance } from "../../commands/routing/rebalance.mjs";
import { runColdRecoveryAuthorize } from "../../commands/recovery/authorize.mjs";
import { runColdRecoveryBootstrap } from "../../commands/recovery/bootstrap.mjs";
import { runColdRecoveryComplete } from "../../commands/recovery/complete.mjs";

export function createManagementHandlers() {
  return {
    initializationApply: runInitializationApply,
    standaloneInit: runStandaloneInitialization,
    configApply: runConfigApply,
    metadataInitialize: runMetadataInitialize,
    reconcile: runReconcile,
    databaseCreate: runDatabaseCreate,
    databaseDelete: runDatabaseDelete,
    databasePlan: runDatabasePlan,
    databaseVerify: runDatabaseVerify,
    applicationCreate: runApplicationCreate,
    applicationStatus: runApplicationStatus,
    appAdminCreate: runAppAdminCreate,
    migrationExplain: runMigrationExplain,
    migrationAction: runMigrationAction,
    nodeResetData: runNodeResetData,
    nodeResync: runNodeResync,
    identityCreate: runIdentityCreate,
    identityRotate: runIdentityRotate,
    accountCreate: runAccountCreate,
    accountRevoke: runAccountRevoke,
    accountVerify: runAccountVerify,
    tokenCreate: runTokenCreate,
    tokenRevoke: runTokenRevoke,
    tokenRotate: runTokenRotate,
    recoveryAcknowledge: runRecoveryAcknowledge,
    recoveryAbort: runRecoveryAbort,
    routingRebalance: runRoutingRebalance,
    coldRecoveryAuthorize: runColdRecoveryAuthorize,
    coldRecoveryBootstrap: runColdRecoveryBootstrap,
    coldRecoveryComplete: runColdRecoveryComplete,
  };
}
