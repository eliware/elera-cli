import { jest } from '@jest/globals';
import { runRoutes } from '../../../src/commands/routing/routes.mjs';
test('emits routes for an application', async () => { const emit = jest.fn(); await runRoutes({ client: { routes: async (application) => ({ application }) }, application: 'app', emit }); expect(emit).toHaveBeenCalledWith({ application: 'app' }); });
