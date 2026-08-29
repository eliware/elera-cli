export async function runDiagnosticsSafety({ client, emit }) { emit(await client.safety()); return 0; }
