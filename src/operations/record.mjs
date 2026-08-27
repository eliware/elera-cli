import { randomUUID } from 'node:crypto';

export function createOperationRecord(action, input = {}, now = () => new Date().toISOString()) {
  return { operationId: randomUUID(), action, requestedAt: now(), input };
}

export function completeOperation(record, outcome, now = () => new Date().toISOString()) {
  return { ...record, completedAt: now(), outcome };
}
