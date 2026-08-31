export async function runNodeResetData({ client, emit, node, confirm, force = false, disposition = 'single-member-resync', idempotencyKey, dryRun = false, confirmationPrefix = 'RESET', endpointConfirmation = confirm, endpointConfirmationField = 'confirm' }) {
  if (!node) throw Object.assign(new Error('node is required'), { exitCode: 2 });
  const expected = `${confirmationPrefix} ${node}`;
  if (confirm !== expected) throw Object.assign(new Error(`node ${confirmationPrefix.toLowerCase()} requires --confirm="${expected}"`), { exitCode: 2 });
  if (disposition !== 'single-member-resync') throw Object.assign(new Error(`unsupported reset disposition: ${disposition}`), { exitCode: 2 });
  if (dryRun) { emit({ ok: true, operation: 'node.data.reset', status: 'planned', changed: false, data: { node, disposition, force } }); return 0; }
  emit(await client.resetNodeData(node, { [endpointConfirmationField]: endpointConfirmation, force, recoveryDisposition: disposition, idempotencyKey }));
  return 0;
}

export async function runNodeResync(options = {}) {
  return runNodeResetData({ ...options, disposition: 'single-member-resync', confirmationPrefix: 'RESYNC', endpointConfirmation: `RESET ${options.node}`, endpointConfirmationField: 'confirmation' });
}
