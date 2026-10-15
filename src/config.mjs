export { projectEnvironment } from "./config/project-environment.mjs";
export { redactCliConfig } from "./config/redact.mjs";
import { projectEnvironment } from "./config/project-environment.mjs";

export function loadCliConfig(environment = process.env) {
  environment = projectEnvironment(environment);
  const endpoint = environment.ELERA_API_ENDPOINT;
  const token = environment.ELERA_CLI_TOKEN;
  const database = environment.ELERA_DATABASE;
  const identity = environment.ELERA_IDENTITY;
  if (!endpoint || !/^https?:\/\//i.test(endpoint))
    throw new TypeError("ELERA_API_ENDPOINT must be an HTTP(S) URL");
  if (!token) throw new TypeError("ELERA_CLI_TOKEN is required");
  const parsed = new URL(endpoint);
  return {
    endpoint: endpoint.replace(/\/$/, ""),
    protocol: environment.ELERA_API_PROTOCOL ?? parsed.protocol.replace(":", ""),
    port: Number(
      environment.ELERA_API_PORT || parsed.port || (parsed.protocol === "https:" ? 443 : 80),
    ),
    token,
    ...(database ? { database } : {}),
    ...(identity ? { identity } : {}),
  };
}
