export async function runReconcile({ client, emit, command, value }) {
  const desired = JSON.parse(value ?? '{}');
  const result = command === 'reconcile-plan' ? await client.reconcilePlan(desired) : command === 'reconcile-apply' ? await client.reconcileApply(desired) : await client.reconcileVerify(desired);
  emit(result); return result.ok === false ? 1 : 0;
}
