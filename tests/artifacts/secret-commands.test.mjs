import { expect, jest, test } from '@jest/globals';
import { createSecretCommands } from '../../src/artifacts/secret-commands.mjs';
test('dispatches a secret list command', async () => { const emit = jest.fn(); const run = createSecretCommands({ client: { listSecrets: jest.fn(async () => ({ items: [] })) }, age: {}, read: jest.fn(), runMaterialize: jest.fn(), emit }); await expect(run('secret-list')).resolves.toBe(true); expect(emit).toHaveBeenCalledWith({ items: [] }); });
