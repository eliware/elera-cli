import { expect, jest, test } from '@jest/globals'; import { runRoutingEvents } from '../../../src/commands/routing/events.mjs';
test('reports routing events', async () => { const emit = jest.fn(); const client = { routingEvents: jest.fn(async () => ({ ok: true })) }; await expect(runRoutingEvents({ client, emit, application: 'app' })).resolves.toBe(0); expect(client.routingEvents).toHaveBeenCalledWith('app'); });
test('returns failure status', async () => { await expect(runRoutingEvents({ client: { routingEvents: async () => ({ ok: false }) }, emit: jest.fn() })).resolves.toBe(1); });
