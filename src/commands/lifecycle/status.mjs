export async function runLifecycleStatus({ lifecycle, emit }) { const result = await lifecycle.nodeStatus(); emit(result); return lifecycle.classify(result); }
