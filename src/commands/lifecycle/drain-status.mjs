export async function runDrainStatus({ lifecycle, emit }) { const result = await lifecycle.drainStatus(); emit(result); return lifecycle.classify(result); }
