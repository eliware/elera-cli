export async function runStop({ lifecycle, emit }) { const result = await lifecycle.stop(); emit(result); return lifecycle.classify(result); }
