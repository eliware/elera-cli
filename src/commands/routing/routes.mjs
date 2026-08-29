export async function runRoutes({ client, emit, application }) { emit(await client.routes(application)); return 0; }
