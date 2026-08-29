import { jest } from '@jest/globals';
import { runConfigInspect } from '../../../src/commands/configuration/inspect.mjs';
test('runs configuration inspection', async () => { const emit = jest.fn(); await runConfigInspect({ client: { intent: async () => ({ ok: true }) }, emit }); expect(emit).toHaveBeenCalledWith({ ok: true }); });
