import * as subject from '../../../src/cli/dispatch/read-only.mjs';
import { dispatchReadOnly } from '../../../src/cli/dispatch/read-only.mjs';
import { jest } from '@jest/globals';
test('exports read-only dispatch', () => expect(Object.keys(subject).length).toBeGreaterThan(0));
test('dispatches the cluster status alias', async () => {
  const clusterStatus = jest.fn(async () => 0);
  await expect(dispatchReadOnly({ command: 'status', client: {}, emit: jest.fn(), handlers: { clusterStatus } })).resolves.toBe(0);
  expect(clusterStatus).toHaveBeenCalled();
});
test('dispatches telemetry and routing watches', async () => {
  const telemetryWatch = jest.fn(async () => 0); const routingWatch = jest.fn(async () => 0);
  const handlers = { telemetryWatch, routingWatch };
  await expect(dispatchReadOnly({ command: 'telemetry-watch', client: {}, emit: jest.fn(), application: 'app', handlers })).resolves.toBe(0);
  await expect(dispatchReadOnly({ command: 'routing-watch', client: {}, emit: jest.fn(), application: 'app', handlers })).resolves.toBe(0);
});
test('dispatches cold-recovery evidence and status', async () => {
  const handlers = { coldRecoveryEvidence: jest.fn(async () => 0), coldRecoveryStatus: jest.fn(async () => 0) };
  await expect(dispatchReadOnly({ command: 'cold-recovery-evidence', client: {}, emit: jest.fn(), handlers })).resolves.toBe(0);
  await expect(dispatchReadOnly({ command: 'cold-recovery-status', client: {}, emit: jest.fn(), handlers })).resolves.toBe(0);
});
