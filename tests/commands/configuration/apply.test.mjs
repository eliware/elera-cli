import { jest } from '@jest/globals';
import { runConfigApply } from '../../../src/commands/configuration/apply.mjs';
test('applies configuration intent', async () => { const emit = jest.fn(); const client = { intent: async () => ({ data: { intent: {} } }), apply: async (value) => ({ value }) }; await runConfigApply({ client, emit }); expect(emit).toHaveBeenCalledWith({ value: {} }); });
