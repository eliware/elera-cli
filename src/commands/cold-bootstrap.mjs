export async function runColdBootstrap({ client, confirm = false, dryRun = false, operationId, ready = true } = {}) {
  if (!client) throw new TypeError("supervisor client is required");
  const plan = await client.coldBootstrapPlan();
  const decision = plan.data ?? plan;
  if (dryRun || !confirm || decision.eligible !== true) return { ok: decision.eligible === true, operation: "cluster.cold-bootstrap.plan", status: dryRun ? "planned" : decision.eligible !== true ? "unsafe" : "confirmation-required", error: decision.eligible !== true ? decision.reason : undefined, data: decision };
  const execution = await client.coldBootstrap({ confirm: true, idempotencyKey: operationId });
  if (!ready) return execution;
  const readiness = await client.ready();
  return { ok: readiness.ok === true && readiness.status === "ok", operation: "cluster.cold-bootstrap", status: readiness.ok === true && readiness.status === "ok" ? "completed" : "not-ready", data: { execution, readiness } };
}
