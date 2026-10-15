export async function runColdRecoveryPlan({ client, emit }) {
  const result = await client.coldRecoveryPlan();
  emit(result);
  return result.ok === false || result.data?.eligible === false ? 1 : 0;
}
