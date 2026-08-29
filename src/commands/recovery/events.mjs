export async function runRecoveryEvents({ client, emit }) { const result = await client.recoveryEvents(); emit(result); return result.ok === false ? 1 : 0; }
