import { expect, jest, test } from '@jest/globals';
import { createMaterializer } from '../../../src/internal/artifacts/materializer.mjs';

test('writes a private temporary file and removes its directory', async () => {
  const calls = []; const materializer = createMaterializer({ makeTemp: async () => 'tmp', id: () => 'id', write: async (...args) => calls.push(['write', ...args]), remove: async (...args) => calls.push(['remove', ...args]) });
  await expect(materializer.withFile('secret', async (path) => { expect(path).toBe('tmp\\id'); return 'ok'; })).resolves.toBe('ok');
  expect(calls[0][0]).toBe('write'); expect(calls[0][3]).toEqual({ mode: 0o600 }); expect(calls[1][0]).toBe('remove');
});
test('cleans up when the operation fails', async () => {
  const remove = jest.fn(async () => {}); const materializer = createMaterializer({ makeTemp: async () => 'tmp', id: () => 'id', write: async () => {}, remove });
  await expect(materializer.withFile('secret', async () => { throw new Error('failed'); })).rejects.toThrow('failed'); expect(remove).toHaveBeenCalled();
});
test('requires an operation callback', async () => { await expect(createMaterializer({ makeTemp: async () => 'tmp' }).withFile('secret')).rejects.toThrow('materializer operation is required'); });
