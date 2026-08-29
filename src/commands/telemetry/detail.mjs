export async function runTelemetryDetail({ client, emit, application }) {
  emit(await client.telemetryDetails(application));
  return 0;
}
