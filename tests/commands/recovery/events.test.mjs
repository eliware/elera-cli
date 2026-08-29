import { expect, jest, test } from '@jest/globals'; import { runRecoveryEvents } from '../../../src/commands/recovery/events.mjs';
test('reports recovery events', async () => { const emit = jest.fn(); await expect(runRecoveryEvents({ client: { recoveryEvents: async () => ({ ok: true }) }, emit })).resolves.toBe(0); expect(emit).toHaveBeenCalled(); });
test('returns failure status', async () => { await expect(runRecoveryEvents({ client: { recoveryEvents: async () => ({ ok: false }) }, emit: jest.fn() })).resolves.toBe(1); });
