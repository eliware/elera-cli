export async function runTelemetryConnections({ client, emit, application }) {
  emit({ ok: true, operation: 'connections', data: await client.telemetryDetails(application) });
  return 0;
}
