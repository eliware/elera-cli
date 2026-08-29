export async function runLifecycleRecover({ lifecycle, emit, target }) { const result = await lifecycle.recover(target); emit(result); return lifecycle.classify(result); }
