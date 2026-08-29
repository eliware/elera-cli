import * as subject from '../../../src/cli/dispatch/read-only.mjs';
import { dispatchReadOnly } from '../../../src/cli/dispatch/read-only.mjs';
import { jest } from '@jest/globals';
test('exports read-only dispatch', () => expect(Object.keys(subject).length).toBeGreaterThan(0));
test('dispatches the cluster status alias', async () => {
  const clusterStatus = jest.fn(async () => 0);
  await expect(dispatchReadOnly({ command: 'status', client: {}, emit: jest.fn(), handlers: { clusterStatus } })).resolves.toBe(0);
  expect(clusterStatus).toHaveBeenCalled();
});
