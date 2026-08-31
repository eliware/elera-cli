export async function runColdRecoveryComplete({ client, emit, input }) { const result = await client.coldRecoveryComplete(input); emit(result); return result.ok === false ? 1 : 0; }
