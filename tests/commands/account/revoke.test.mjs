import { jest } from '@jest/globals'; import { runAccountRevoke } from '../../../src/commands/account/revoke.mjs';
test('revokes an account', async () => { const revokeAccount = jest.fn(async () => ({ ok: true })); await runAccountRevoke({ client: { revokeAccount }, emit: jest.fn(), user: 'u' }); expect(revokeAccount).toHaveBeenCalledWith({ user: 'u', host: '%' }); });
