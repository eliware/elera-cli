import { expect, jest, test } from '@jest/globals'; import { runRecoveryAbort } from '../../../src/commands/recovery/abort.mjs';
test('aborts recovery', async () => { const emit = jest.fn(); const client = { recoveryAbort: jest.fn(async () => ({ ok: true })) }; await expect(runRecoveryAbort({ client, emit, reason: 'stop' })).resolves.toBe(0); expect(client.recoveryAbort).toHaveBeenCalledWith('stop'); });
test('returns failure status', async () => { await expect(runRecoveryAbort({ client: { recoveryAbort: async () => ({ ok: false }) }, emit: jest.fn() })).resolves.toBe(1); });
