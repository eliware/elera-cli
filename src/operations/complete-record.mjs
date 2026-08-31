export function completeOperation(record, outcome, now = () => new Date().toISOString()) { return { ...record, completedAt: now(), outcome }; }
