import { jest } from '@jest/globals';
import { runMetadataStatus } from '../../../src/commands/metadata/status.mjs';
test('reads metadata status', async () => { const emit = jest.fn(); await runMetadataStatus({ client: { metadataStatus: async () => ({ ok: true }) }, emit }); expect(emit).toHaveBeenCalledWith({ ok: true }); });
