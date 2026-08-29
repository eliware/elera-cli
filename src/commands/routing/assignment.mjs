export async function runAssignment({ client, emit, application, identity }) {
  const bundle = await client.routingBundle(identity);
  emit({ ok: true, operation: 'assignment-status', data: { application: bundle.application, database: bundle.database, writer: bundle.writer, failover: bundle.failover, readers: bundle.readers, bundleVersion: bundle.bundleVersion } });
  return 0;
}

export async function runBundleVersion({ client, emit, application, identity }) {
  const bundle = await client.routingBundle(identity);
  emit({ ok: true, operation: 'bundle-version', data: { bundleVersion: bundle.bundleVersion, writer: bundle.writer, application: bundle.application, database: bundle.database } });
  return 0;
}
