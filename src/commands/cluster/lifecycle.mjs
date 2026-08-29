export async function runClusterPlan({ client, emit, action, target }) { if (!action) throw Object.assign(new Error('cluster-plan requires an action'), { exitCode: 2 }); emit(await client.lifecyclePlan(action, { target })); return 0; }
export async function runClusterAction({ client, emit, action, target }) { emit(await client.lifecycle(action, { target })); return 0; }
