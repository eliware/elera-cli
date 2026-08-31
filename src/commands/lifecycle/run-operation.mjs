import { completeOperation, createOperationRecord } from '../../operations/record.mjs';
export async function runLifecycleOperation({ action, input, operation, now }) { const record = createOperationRecord(action, input, now); return completeOperation(record, await operation(), now); }
