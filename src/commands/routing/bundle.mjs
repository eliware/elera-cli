export async function runBundle({ client, emit, identity }) { emit(await client.routingBundle(identity)); return 0; }
