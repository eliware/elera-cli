export async function runRoutingRebalance({ client, emit, application }) { const result = await client.routingRebalance(application); emit(result); return result.ok === false ? 1 : 0; }
