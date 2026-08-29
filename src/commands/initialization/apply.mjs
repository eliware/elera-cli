export async function runInitializationApply({ client, emit }) { emit(await client.initializationApply()); return 0; }
