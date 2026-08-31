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

test('preserves structured authorization and idempotency failures', async () => {
  const body = { error: { code: 'idempotency_conflict', message: 'operation already used' }, operationId: 'op-1' };
  const request = createSupervisorRequest({ endpoint: 'http://node', token: 'secret', fetchImpl: async () => response(body, false, 409) });
  await expect(request('/api/v1/databases/2/delete', { body: JSON.stringify({ confirm: true, idempotencyKey: 'op-1' }) })).rejects.toMatchObject({ message: 'operation already used', statusCode: 409, body });
});
