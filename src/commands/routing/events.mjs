export async function runRoutingEvents({ client, emit, application }) { const result = await client.routingEvents(application); emit(result); return result.ok === false ? 1 : 0; }
