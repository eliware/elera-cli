export async function runColdRecoveryBootstrap({ client, emit, input }) { const result = await client.coldRecoveryBootstrap(input); emit(result); return result.ok === false ? 1 : 0; }
