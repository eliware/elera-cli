export async function runRecoveryStatus({ client, emit }) { const result = await client.recoveryStatus(); emit(result); return result.ok === false ? 1 : 0; }
