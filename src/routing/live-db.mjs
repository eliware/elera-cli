import { createDbFromBundle, createRoutingStream } from '@eliware/elera-lib';

export async function createLiveDb({ bundle, endpoint, token, application, fetchBundle, createDb = createDbFromBundle, createStream = createRoutingStream } = {}) {
  if (!bundle || !endpoint || !token || typeof fetchBundle !== 'function') throw new TypeError('bundle, endpoint, token, and fetchBundle are required');
  const db = await createDb({ bundle });
  const stream = createStream({ endpoint, token, application, fetchBundle });
  await db.attachRoutingStream(stream);
  return {
    db,
    stream,
    async close() {
      stream.close();
      await db.close();
    },
  };
}
