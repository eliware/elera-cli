import { expect, jest, test } from '@jest/globals';
import { createRecoveryStateEndpoints } from '../../src/client/recovery-state-endpoints.mjs';
test('creates recovery state endpoints', async () => { const request = jest.fn(async () => ({ ok: true })); const endpoints = createRecoveryStateEndpoints(request); await endpoints.recoveryStatus(); await endpoints.recoveryEvents(); await endpoints.recoveryAcknowledge('reason'); await endpoints.recoveryAbort('reason'); expect(request).toHaveBeenCalledTimes(4); });
