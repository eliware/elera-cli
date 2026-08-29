export async function runIdentityRotate({ client, emit, identity }) { emit(await client.rotateIdentity(identity)); return 0; }
