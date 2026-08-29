import { jest } from '@jest/globals';
import { runAccountList } from '../../../src/commands/account/list.mjs';
test('lists managed accounts', async () => { const emit = jest.fn(); await runAccountList({ client: { accounts: async () => ({ ok: true }) }, emit }); expect(emit).toHaveBeenCalledWith({ ok: true }); });
