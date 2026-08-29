export async function dispatchLifecycle({ command, client, controlClient, lifecycle, emit, target, lifecycleCommands, handlers }) {
  if (command === 'cluster-bootstrap') return handlers.bootstrap({ client: controlClient, emit });
  if (command === 'cluster-join') return handlers.join({ client: controlClient, emit, target });
  if (command === 'cluster-rejoin') return handlers.rejoin({ client: controlClient, emit, target });
  if (command === 'drain') return handlers.drain({ lifecycle, emit });
  if (command === 'undrain') return handlers.undrain({ lifecycle, emit });
  if (command === 'drain-status') return handlers.drainStatus({ lifecycle, emit });
  if (command === 'stop') return handlers.stop({ lifecycle, emit });
  if (command === 'node-status') return handlers.status({ lifecycle, emit });
  if (command === 'recover') return handlers.recover({ lifecycle, emit, target });
  if (lifecycleCommands[command]) {
    emit(await controlClient.lifecycle(lifecycleCommands[command], { target }));
    return 0;
  }
  return undefined;
}
