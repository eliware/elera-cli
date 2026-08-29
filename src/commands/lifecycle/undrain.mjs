export async function runUndrain({ lifecycle, emit }) { const result = await lifecycle.undrain(); emit(result); return lifecycle.classify(result); }
