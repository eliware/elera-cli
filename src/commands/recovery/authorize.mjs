export async function runColdRecoveryAuthorize({ client, emit, input }) {
  const result = await client.coldRecoveryAuthorize(input);
  emit(result);
  return result.ok === false ? 1 : 0;
}
