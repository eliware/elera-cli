export async function runClusterStatus({ client, emit }) { emit(await client.status()); return 0; }
export async function runClusterObservations({ client, emit }) { emit(await client.observations()); return 0; }
export async function runClusterQuorum({ client, emit }) { const result = await client.quorum(); emit(result); return result.data?.quorum ? 0 : 1; }
