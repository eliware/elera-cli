export async function runApplicationCreate({ client, emit, name }) { emit(await client.createApplication(name)); return 0; }
