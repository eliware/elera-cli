export async function createLiveDb({ bundle, endpoint, token, fetchBundle, createDb: createClient } = {}) {
  if (!bundle || !endpoint || !token || typeof fetchBundle !== 'function' || typeof createClient !== 'function') throw new TypeError('bundle, endpoint, token, fetchBundle, and createDb are required');
  const db = await createClient({ endpoint, token });
  return {
    db,
    stream: undefined,
    async close() {
      await db.close();
    },
  };
}
