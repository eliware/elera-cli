import { jest } from '@jest/globals';
import { runConfigVerify } from '../../../src/commands/configuration/verify.mjs';
test('verifies configuration', async () => { const emit = jest.fn(); await runConfigVerify({ client: { verify: async () => ({ ok: true }) }, emit }); expect(emit).toHaveBeenCalledWith({ ok: true }); });
