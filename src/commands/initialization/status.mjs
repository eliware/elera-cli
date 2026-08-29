export async function runInitializationStatus({ client, emit }) { emit(await client.initializationStatus()); return 0; }
