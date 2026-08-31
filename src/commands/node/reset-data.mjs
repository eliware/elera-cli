const expectedConfirmation = (node) => `RESET ${node}`;

export async function runNodeResetData({ client, emit, node, confirm, force = false, disposition = 'single-member-resync', idempotencyKey, dryRun = false }) {
  if (!node) throw Object.assign(new Error('node is required'), { exitCode: 2 });
  if (confirm !== expectedConfirmation(node)) throw Object.assign(new Error(`node reset requires --confirm="${expectedConfirmation(node)}"`), { exitCode: 2 });
  if (disposition !== 'single-member-resync') throw Object.assign(new Error(`unsupported reset disposition: ${disposition}`), { exitCode: 2 });
  if (dryRun) { emit({ ok: true, operation: 'node.data.reset', status: 'planned', changed: false, data: { node, disposition, force } }); return 0; }
  emit(await client.resetNodeData(node, { confirm, force, disposition, idempotencyKey }));
  return 0;
}
