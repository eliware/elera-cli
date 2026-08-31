import { expect, jest, test } from '@jest/globals';
import { runColdRecoveryAuthorize } from '../../../src/commands/recovery/authorize.mjs';
test('authorizes cold recovery input', async () => { const emit = jest.fn(); await expect(runColdRecoveryAuthorize({ client: { coldRecoveryAuthorize: jest.fn(async () => ({ ok: true })) }, emit, input: {} })).resolves.toBe(0); });
