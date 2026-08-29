import { expect, jest, test } from '@jest/globals';
import { runColdRecoveryEvidence, runColdRecoveryStatus, runColdRecoveryPlan, runColdRecoveryAuthorize, runColdRecoveryBootstrap, runColdRecoveryComplete } from '../../../src/commands/recovery/protocol.mjs';

function client() {
  return {
    coldRecoveryEvidence: jest.fn(async () => ({ ok: true, data: { evidence: [] } })),
    coldRecoveryStatus: jest.fn(async () => ({ ok: true, data: { phase: 'evidence' } })),
    coldRecoveryPlan: jest.fn(async () => ({ ok: true, data: { eligible: true } })),
    coldRecoveryAuthorize: jest.fn(async (input) => ({ ok: true, data: input })),
    coldRecoveryBootstrap: jest.fn(async (input) => ({ ok: true, data: input })),
    coldRecoveryComplete: jest.fn(async (input) => ({ ok: true, data: input })),
  };
}

test('dispatches all cold-recovery protocol handlers through the client', async () => {
  const target = client(); const emit = jest.fn(); const input = { epoch: 'e', winner: 'elera-0', membership: ['elera-0'] };
  await expect(runColdRecoveryEvidence({ client: target, emit })).resolves.toBe(0);
  await expect(runColdRecoveryStatus({ client: target, emit })).resolves.toBe(0);
  await expect(runColdRecoveryPlan({ client: target, emit })).resolves.toBe(0);
  await expect(runColdRecoveryAuthorize({ client: target, emit, input })).resolves.toBe(0);
  await expect(runColdRecoveryBootstrap({ client: target, emit, input })).resolves.toBe(0);
  await expect(runColdRecoveryComplete({ client: target, emit, input })).resolves.toBe(0);
  expect(target.coldRecoveryAuthorize).toHaveBeenCalledWith(input);
  expect(target.coldRecoveryBootstrap).toHaveBeenCalledWith(input);
  expect(target.coldRecoveryComplete).toHaveBeenCalledWith(input);
  expect(emit).toHaveBeenCalledTimes(6);
});

test('returns failure codes for rejected protocol responses', async () => {
  const target = {
    coldRecoveryEvidence: async () => ({ ok: false }), coldRecoveryStatus: async () => ({ ok: false }),
    coldRecoveryPlan: async () => ({ ok: false, data: { eligible: true } }), coldRecoveryAuthorize: async () => ({ ok: false }),
    coldRecoveryBootstrap: async () => ({ ok: false }), coldRecoveryComplete: async () => ({ ok: false }),
  };
  const emit = jest.fn();
  await expect(runColdRecoveryEvidence({ client: target, emit })).resolves.toBe(1);
  await expect(runColdRecoveryStatus({ client: target, emit })).resolves.toBe(1);
  await expect(runColdRecoveryPlan({ client: target, emit })).resolves.toBe(1);
  await expect(runColdRecoveryAuthorize({ client: target, emit, input: {} })).resolves.toBe(1);
  await expect(runColdRecoveryBootstrap({ client: target, emit, input: {} })).resolves.toBe(1);
  await expect(runColdRecoveryComplete({ client: target, emit, input: {} })).resolves.toBe(1);
});
