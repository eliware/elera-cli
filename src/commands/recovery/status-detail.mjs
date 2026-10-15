export async function runColdRecoveryStatus({ client, emit }) {
  const result = await client.coldRecoveryStatus();
  emit(result);
  return result.ok === false ? 1 : 0;
}
