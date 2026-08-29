export async function runHealthStatus({ client, emit }) {
  const result = await client.health();
  emit(result);
  return result.ok ? 0 : 1;
}
