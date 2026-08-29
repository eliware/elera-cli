import { jest } from '@jest/globals'; import { runAccountVerify } from '../../../src/commands/account/verify.mjs';
test('verifies an account', async () => { const verifyAccount = jest.fn(async () => ({ ok: true })); await runAccountVerify({ client: { verifyAccount }, emit: jest.fn(), user: 'u', host: 'localhost' }); expect(verifyAccount).toHaveBeenCalledWith({ user: 'u', host: 'localhost' }); });
