import { generate as generateSnowflake } from '@eliware/snowflake';
export function createOperationRecord(action, input = {}, now = () => new Date().toISOString()) { return { operationId: generateSnowflake(), action, requestedAt: now(), input }; }
