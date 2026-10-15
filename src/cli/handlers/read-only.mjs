import { runHealthStatus } from "../../commands/health/status.mjs";
import { runHealthReady } from "../../commands/health/ready.mjs";
import { runTelemetrySummary } from "../../commands/telemetry/summary.mjs";
import { runTelemetryDetail } from "../../commands/telemetry/detail.mjs";
import { runTelemetryConnections } from "../../commands/telemetry/connections.mjs";
import { runTelemetryWatch } from "../../commands/telemetry/watch.mjs";
import {
  runClusterStatus,
  runClusterObservations,
  runClusterQuorum,
} from "../../commands/cluster/status.mjs";
import { runColdRecoveryEvidence } from "../../commands/recovery/evidence.mjs";
import { runColdRecoveryStatus } from "../../commands/recovery/status-detail.mjs";
import { runColdRecoveryPlan } from "../../commands/recovery/plan.mjs";
import { runAssignment, runBundleVersion } from "../../commands/routing/assignment.mjs";
import { runRoutes } from "../../commands/routing/routes.mjs";
import { runBundle } from "../../commands/routing/bundle.mjs";
import { runResync } from "../../commands/routing/resync.mjs";
import { runRoutingValidate } from "../../commands/routing/validate.mjs";
import { runRoutingEvents } from "../../commands/routing/events.mjs";
import { runRoutingWatch } from "../../commands/routing/watch.mjs";
import { runConfigInspect } from "../../commands/configuration/inspect.mjs";
import { runConfigVerify } from "../../commands/configuration/verify.mjs";
import { runMetadataStatus } from "../../commands/metadata/status.mjs";
import { runMetadataVerify } from "../../commands/metadata/verify.mjs";
import { runDatabaseList } from "../../commands/database/list.mjs";
import { runIdentityList } from "../../commands/identity/list.mjs";
import { runAccountList } from "../../commands/account/list.mjs";
import { runTokenList } from "../../commands/access-keys/list.mjs";

export function createReadOnlyHandlers({ config, argv }) {
  return {
    health: runHealthStatus,
    initializationPlan: runInitializationPlan,
    initializationStatus: runInitializationStatus,
    initializationVerify: runInitializationVerify,
    recoveryEvents: runRecoveryEvents,
    recoveryStatus: runRecoveryStatus,
    ready: runHealthReady,
    telemetry: runTelemetrySummary,
    telemetryDetail: runTelemetryDetail,
    connections: runTelemetryConnections,
    telemetryWatch: (value) =>
      runTelemetryWatch({ ...value, ...config, once: argv.includes("--once") }),
    clusterStatus: runClusterStatus,
    clusterObservations: runClusterObservations,
    nodeEvidence: async ({ client, emit }) => {
      emit(await client.coldBootstrapEvidence());
      return 0;
    },
    coldRecoveryEvidence: runColdRecoveryEvidence,
    coldRecoveryStatus: runColdRecoveryStatus,
    coldRecoveryPlan: runColdRecoveryPlan,
    clusterQuorum: runClusterQuorum,
    assignment: runAssignment,
    bundleVersion: runBundleVersion,
    routes: runRoutes,
    bundle: runBundle,
    resync: runResync,
    routingValidate: runRoutingValidate,
    routingEvents: runRoutingEvents,
    routingWatch: (value) =>
      runRoutingWatch({ ...value, ...config, once: argv.includes("--once") }),
    configInspect: runConfigInspect,
    configVerify: runConfigVerify,
    metadataStatus: runMetadataStatus,
    metadataVerify: runMetadataVerify,
    databaseList: runDatabaseList,
    identityList: runIdentityList,
    accountList: runAccountList,
    tokenList: runTokenList,
  };
}
import { runInitializationPlan } from "../../commands/initialization/plan.mjs";
import { runInitializationStatus } from "../../commands/initialization/status.mjs";
import { runInitializationVerify } from "../../commands/initialization/verify.mjs";
import { runRecoveryEvents } from "../../commands/recovery/events.mjs";
import { runRecoveryStatus } from "../../commands/recovery/status.mjs";
