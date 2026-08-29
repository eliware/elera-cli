import { jest } from '@jest/globals';
import { runReconcile } from '../../../src/commands/metadata/reconcile.mjs';
test('runs each reconciliation operation', async () => { const emit = jest.fn(); const client = { reconcilePlan: async (value) => value, reconcileApply: async (value) => value, reconcileVerify: async (value) => value }; for (const command of ['reconcile-plan', 'reconcile-apply', 'reconcile-verify']) expect(await runReconcile({ client, emit, command, value: '{}' })).toBe(0); expect(emit).toHaveBeenCalledTimes(3); });
