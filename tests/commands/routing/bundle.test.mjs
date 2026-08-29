import { jest } from '@jest/globals';
import { runBundle } from '../../../src/commands/routing/bundle.mjs';
test('emits a routing bundle', async () => { const emit = jest.fn(); await runBundle({ client: { routingBundle: async (application) => ({ application }) }, identity: 'runtime', emit }); expect(emit).toHaveBeenCalledWith({ application: 'runtime' }); });
