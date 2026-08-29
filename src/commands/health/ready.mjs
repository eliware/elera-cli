export async function runHealthReady({ client, emit }) {
  const result = await client.ready();
  emit(result);
  return result.ok && result.status === 'ok' ? 0 : 1;
}
