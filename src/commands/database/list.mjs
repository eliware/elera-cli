export async function runDatabaseList({ client, emit }) { emit(await client.databases()); return 0; }
