export async function runResync({ client, emit, application }) { emit(await client.resync(application)); return 0; }
