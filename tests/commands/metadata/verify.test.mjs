import { jest } from '@jest/globals';
import { runMetadataVerify } from '../../../src/commands/metadata/verify.mjs';
test('verifies metadata', async () => { const emit = jest.fn(); expect(await runMetadataVerify({ client: { metadataVerify: async () => ({ ok: true }) }, emit })).toBe(0); });
