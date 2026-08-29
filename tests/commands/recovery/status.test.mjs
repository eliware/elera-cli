import { expect, jest, test } from '@jest/globals'; import { runRecoveryStatus } from '../../../src/commands/recovery/status.mjs';
test('reports recovery status', async () => { const emit = jest.fn(); await expect(runRecoveryStatus({ client: { recoveryStatus: async () => ({ ok: true }) }, emit })).resolves.toBe(0); expect(emit).toHaveBeenCalled(); });
test('returns failure status', async () => { await expect(runRecoveryStatus({ client: { recoveryStatus: async () => ({ ok: false }) }, emit: jest.fn() })).resolves.toBe(1); });
