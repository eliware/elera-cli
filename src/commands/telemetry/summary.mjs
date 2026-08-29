export async function runTelemetrySummary({ client, emit }) {
  emit(await client.telemetry());
  return 0;
}
