export async function runRecoveryAcknowledge({ client, emit, reason }) { const result = await client.recoveryAcknowledge(reason); emit(result); return result.ok === false ? 1 : 0; }
