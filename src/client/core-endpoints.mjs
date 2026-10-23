import { createHealthEndpoints } from "./health-endpoints.mjs";
import { createApplicationEndpoints } from "./application-endpoints.mjs";
import { createTelemetryEndpoints } from "./telemetry-endpoints.mjs";
import { createConfigurationEndpoints } from "./configuration-endpoints.mjs";
import { createAccountEndpoints } from "./account-endpoints.mjs";
import { createIdentityEndpoints } from "./identity-endpoints.mjs";
import { createDatabaseEndpoints } from "./database-endpoints.mjs";
import { createSecretEndpoints } from "./secret-endpoints.mjs";
import { createCredentialEndpoints } from "./credential-endpoints.mjs";
import { createSystemEndpoints } from "./system-endpoints.mjs";
import { createTokenEndpoints } from "./token-endpoints.mjs";
import { createSqlEndpoints } from "./sql-endpoints.mjs";

export function createCoreEndpoints(request, validateBundle) {
  return {
    ...createHealthEndpoints(request),
    ...createApplicationEndpoints(request),
    ...createTelemetryEndpoints(request),
    ...createConfigurationEndpoints(request),
    ...createAccountEndpoints(request),
    ...createIdentityEndpoints(request),
    ...createDatabaseEndpoints(request),
    ...createSecretEndpoints(request),
    ...createCredentialEndpoints(request, validateBundle),
    ...createSystemEndpoints(request),
    ...createTokenEndpoints(request),
    ...createSqlEndpoints(request),
  };
}
