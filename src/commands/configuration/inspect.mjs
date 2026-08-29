export async function runConfigInspect({ client, emit }) { emit(await client.intent()); return 0; }
