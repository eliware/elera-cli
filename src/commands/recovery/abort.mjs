export async function runRecoveryAbort({ client, emit, reason }) { const result = await client.recoveryAbort(reason); emit(result); return result.ok === false ? 1 : 0; }
