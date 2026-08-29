export async function runTokenRotate({ client, emit, token }) { emit(await client.rotateToken(token)); return 0; }
