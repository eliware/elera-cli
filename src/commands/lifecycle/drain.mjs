export async function runDrain({ lifecycle, emit }) { const result = await lifecycle.drain(); emit(result); return lifecycle.classify(result); }
