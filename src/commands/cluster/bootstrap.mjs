export async function runClusterBootstrap({ client, emit }) { emit(await client.bootstrap()); return 0; }
