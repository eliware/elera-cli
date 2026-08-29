import { expect, test } from '@jest/globals';
import { completeOperation, createOperationRecord } from '../../src/operations/record.mjs';

test('records requested and completed operation metadata', () => {
  const record = createOperationRecord('traffic.drain', { node: 'n' }, () => 'request');
  expect(completeOperation(record, { ok: true }, () => 'complete')).toMatchObject({ operationId: expect.any(String), action: 'traffic.drain', requestedAt: 'request', completedAt: 'complete', outcome: { ok: true } });
});

test('supports default timestamps and empty values', () => {
  const record = createOperationRecord('node.status');
  expect(completeOperation(record, null)).toMatchObject({ operationId: record.operationId, outcome: null });
});
