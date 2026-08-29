import { generate as generateSnowflake } from '@eliware/snowflake';

export function createOperationRecord(action, input = {}, now = () => new Date().toISOString()) {
  return { operationId: generateSnowflake(), action, requestedAt: now(), input };
}

export function completeOperation(record, outcome, now = () => new Date().toISOString()) {
  return { ...record, completedAt: now(), outcome };
}
