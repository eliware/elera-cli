import { resolveByName } from '../lookup.mjs';
export async function runApplicationStatus({ client, emit, applicationId }) { const applications = await client.applications(); const records = applications.data ?? applications; const id = resolveByName(Array.isArray(records) ? records : records.applications ?? [], applicationId, 'application'); emit(await client.applicationStatus(id)); return 0; }
