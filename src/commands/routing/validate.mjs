export async function runRoutingValidate({ client, emit, application }) { const result = await client.routingValidate(application); emit(result); return result.ok === false ? 1 : 0; }
