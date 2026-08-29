export async function runMigrationDiagnostics({ diagnose, emit, endpoint, configPath }) { const result = await diagnose({ endpoint, configPath }); emit(result); return result.ok ? 0 : 1; }
