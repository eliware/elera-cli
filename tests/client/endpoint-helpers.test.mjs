import { jest } from '@jest/globals';
import { encoded, jsonRequest } from '../../src/client/endpoint-helpers.mjs';

test('encodes values and treats absent values as empty strings', () => {
  expect(encoded('a b')).toBe('a%20b');
  expect(encoded()).toBe('');
});

test('builds JSON requests with the selected method', async () => {
  const request = jest.fn(async () => ({ ok: true }));
  await jsonRequest(request, '/path', { value: 1 }, 'PUT');
  expect(request).toHaveBeenCalledWith('/path', expect.objectContaining({ method: 'PUT', body: '{"value":1}' }));
});
