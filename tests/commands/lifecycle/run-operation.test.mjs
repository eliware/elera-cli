import { expect, test } from '@jest/globals';
import { runLifecycleOperation } from '../../../src/commands/lifecycle/run-operation.mjs';
test('records a lifecycle operation result', async () => { await expect(runLifecycleOperation({ action: 'test', input: {}, operation: async () => ({ ok: true }), now: () => 'now' })).resolves.toMatchObject({ action: 'test', outcome: { ok: true }, completedAt: 'now' }); });
