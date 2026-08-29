import { jest } from '@jest/globals';
import { runHealthReady } from '../../../src/commands/health/ready.mjs';
test('maps ready status', async () => { const emit = jest.fn(); await expect(runHealthReady({ client: { ready: async () => ({ ok: true, status: 'ok' }) }, emit })).resolves.toBe(0); await expect(runHealthReady({ client: { ready: async () => ({ ok: true, status: 'degraded' }) }, emit })).resolves.toBe(1); });
