import { resolveByName } from './lookup.mjs';
export async function runApplicationCreate({ client, emit, name }) { emit(await client.createApplication(name)); return 0; }
export async function runApplicationStatus({ client, emit, applicationId }) {
  const applications = await client.applications();
  const records = applications.data ?? applications;
  const id = resolveByName(Array.isArray(records) ? records : records.applications ?? [], applicationId, 'application');
  emit(await client.applicationStatus(id));
  return 0;
}
export async function runAppAdminCreate({ client, emit, application, tokenName }) { emit(await client.createAppAdminToken(application, tokenName)); return 0; }
