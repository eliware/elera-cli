export async function runColdRecoveryEvidence({ client, emit }) { const result = await client.coldRecoveryEvidence(); emit(result); return result.ok === false ? 1 : 0; }
export async function runColdRecoveryStatus({ client, emit }) { const result = await client.coldRecoveryStatus(); emit(result); return result.ok === false ? 1 : 0; }
export async function runColdRecoveryPlan({ client, emit }) { const result = await client.coldRecoveryPlan(); emit(result); return result.ok === false || result.data?.eligible === false ? 1 : 0; }
export async function runColdRecoveryAuthorize({ client, emit, input }) { const result = await client.coldRecoveryAuthorize(input); emit(result); return result.ok === false ? 1 : 0; }
export async function runColdRecoveryBootstrap({ client, emit, input }) { const result = await client.coldRecoveryBootstrap(input); emit(result); return result.ok === false ? 1 : 0; }
export async function runColdRecoveryComplete({ client, emit, input }) { const result = await client.coldRecoveryComplete(input); emit(result); return result.ok === false ? 1 : 0; }
