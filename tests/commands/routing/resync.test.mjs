import { jest } from '@jest/globals';
import { runResync } from '../../../src/commands/routing/resync.mjs';
test('emits routing resync result', async () => { const emit = jest.fn(); await runResync({ client: { resync: async () => ({ ok: true }) }, application: 'app', emit }); expect(emit).toHaveBeenCalledWith({ ok: true }); });
