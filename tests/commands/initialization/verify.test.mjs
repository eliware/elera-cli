import { jest } from '@jest/globals'; import { runInitializationVerify } from '../../../src/commands/initialization/verify.mjs';
test('maps initialization verification failure', async () => { const emit = jest.fn(); await expect(runInitializationVerify({ client: { initializationVerify: async () => ({ ok: false }) }, emit })).resolves.toBe(1); });
