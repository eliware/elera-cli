export function createClientContext({ config, createClient, targetEndpoint, operationId }) {
  const client = createClient({ ...config, operationId });
  const controlClient = targetEndpoint
    ? createClient({ ...config, endpoint: targetEndpoint.replace(/\/$/, ''), operationId })
    : client;
  return Object.freeze({ client, controlClient });
}

export function resolveTargetEndpoint({ config, explicitTarget, targetHost }) {
  if (explicitTarget) return explicitTarget;
  if (targetHost) return `${config.protocol}://${targetHost}:${config.port}`;
  return undefined;
}
