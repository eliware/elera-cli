import { jest } from '@jest/globals'; import { runIdentityList } from '../../../src/commands/identity/list.mjs';
test('lists identities', async () => { const emit = jest.fn(); await runIdentityList({ client: { identities: async () => ({ ok: true }) }, emit, application: 'app' }); expect(emit).toHaveBeenCalledWith({ ok: true }); });
