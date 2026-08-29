export async function runClusterJoin({ client, emit, target }) { emit(await client.lifecycle('join', { target })); return 0; }
