export async function runApplicationCreate({ client, emit, name }) { emit(await client.createApplication(name)); return 0; }
export async function runApplicationStatus({ client, emit, applicationId }) { emit(await client.applicationStatus(applicationId)); return 0; }
export async function runAppAdminCreate({ client, emit, application, tokenName }) { emit(await client.createAppAdminToken(application, tokenName)); return 0; }
