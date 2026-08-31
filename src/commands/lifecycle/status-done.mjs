export function lifecycleStatusDone(data) { return Boolean(data?.lifecycle === 'stopped' || (data?.drained && Number(data?.active ?? 0) === 0)); }
