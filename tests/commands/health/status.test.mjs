import { jest } from '@jest/globals';
import { runHealthStatus } from '../../../src/commands/health/status.mjs';
test('runs health status and maps result', async () => { const client = { health: jest.fn(async () => ({ ok: true })) }; const emit = jest.fn(); await expect(runHealthStatus({ client, emit })).resolves.toBe(0); expect(emit).toHaveBeenCalledWith({ ok: true }); });
