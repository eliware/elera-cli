export async function runAppAdminCreate({ client, emit, application, tokenName }) { emit(await client.createAppAdminToken(application, tokenName)); return 0; }
