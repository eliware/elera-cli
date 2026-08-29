import { jest } from '@jest/globals';
import { createSupervisorRequest } from '../../src/transport/supervisor-request.mjs';

const response = (body, ok = true, status = 200) => ({ ok, status, headers: { get: () => 'application/json' }, json: async () => body });

test('adds endpoint authentication and operation headers', async () => {
  const fetchImpl = jest.fn(async () => response({ ok: true }));
  await createSupervisorRequest({ endpoint: 'http://node/', token: 'secret', operationId: 'op-1', fetchImpl })('/healthz');
  expect(fetchImpl).toHaveBeenCalledWith('http://node/healthz', expect.objectContaining({ headers: expect.objectContaining({ authorization: 'Bearer secret', 'x-elera-operation-id': 'op-1' }) }));
});

test('turns rejected responses into stable errors', async () => {
  const request = createSupervisorRequest({ endpoint: 'http://node', token: 'secret', fetchImpl: async () => response({ error: { message: 'denied' } }, false, 403) });
  await expect(request('/private')).rejects.toMatchObject({ message: 'denied', statusCode: 403, body: { error: { message: 'denied' } } });
});
