import { jest } from '@jest/globals'; import { runClusterJoin } from '../../../src/commands/cluster/join.mjs';
test('joins the selected target', async () => { const lifecycle = jest.fn(async () => ({ ok: true })); await runClusterJoin({ client: { lifecycle }, emit: jest.fn(), target: 'elera-1' }); expect(lifecycle).toHaveBeenCalledWith('join', { target: 'elera-1' }); });
