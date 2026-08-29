export async function runDatabaseCreate({ client, emit, application, database }) { emit(await client.provisionDatabase(application, database)); return 0; }
