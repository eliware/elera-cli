import { jest } from '@jest/globals';
import { runMetadataInitialize } from '../../../src/commands/metadata/initialize.mjs';
test('initializes metadata', async () => { const emit = jest.fn(); await runMetadataInitialize({ client: { metadataInitialize: async () => ({ ok: true }) }, emit }); expect(emit).toHaveBeenCalledWith({ ok: true }); });
