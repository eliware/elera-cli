export async function runMigrationWorkflow({ client, emit, workflow, input }) {
  const result = await workflow(client, input);
  emit({ ok: true, operation: "migration", data: result });
  return 0;
}
