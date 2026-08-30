import { jest } from '@jest/globals';
import { runStandaloneInitialization } from '../../../src/commands/initialization/standalone.mjs';

test('reports standalone initialization failure', async () => {
  const emit = jest.fn();
  await expect(runStandaloneInitialization({ client: { initializationApply: async () => ({ ok: false }) }, emit })).resolves.toBe(1);
});
