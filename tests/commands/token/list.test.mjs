import { jest } from '@jest/globals';
import { runTokenList } from '../../../src/commands/token/list.mjs';
test('lists redacted tokens', async () => { const emit = jest.fn(); await runTokenList({ client: { tokens: async () => ({ ok: true }) }, emit }); expect(emit).toHaveBeenCalledWith({ ok: true }); });
