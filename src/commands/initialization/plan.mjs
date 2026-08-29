export async function runInitializationPlan({ client, emit }) { emit(await client.initializationPlan()); return 0; }
