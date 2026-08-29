import { jest } from '@jest/globals'; import { runTokenRevoke } from '../../../src/commands/token/revoke.mjs';
test('revokes a token', async () => { const revokeToken = jest.fn(async () => ({ ok: true })); await runTokenRevoke({ client: { revokeToken }, emit: jest.fn(), token: 't' }); expect(revokeToken).toHaveBeenCalledWith('t'); });
