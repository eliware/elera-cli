import { jest } from '@jest/globals'; import { runIdentityRotate } from '../../../src/commands/identity/rotate.mjs';
test('rotates an identity', async () => { const rotateIdentity = jest.fn(async () => ({ ok: true })); await runIdentityRotate({ client: { rotateIdentity }, emit: jest.fn(), identity: 'runtime' }); expect(rotateIdentity).toHaveBeenCalledWith('runtime'); });
