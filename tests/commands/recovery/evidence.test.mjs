import { expect, jest, test } from '@jest/globals';
import { runColdRecoveryEvidence } from '../../../src/commands/recovery/evidence.mjs';
test('emits cold recovery evidence', async () => { const emit = jest.fn(); await expect(runColdRecoveryEvidence({ client: { coldRecoveryEvidence: jest.fn(async () => ({ ok: true })) }, emit })).resolves.toBe(0); expect(emit).toHaveBeenCalled(); });
