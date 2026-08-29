import { jest } from '@jest/globals'; import { runClusterBootstrap } from '../../../src/commands/cluster/bootstrap.mjs';
test('bootstraps through the control client', async () => { const emit = jest.fn(); await expect(runClusterBootstrap({ client: { bootstrap: async () => ({ ok: true }) }, emit })).resolves.toBe(0); });
