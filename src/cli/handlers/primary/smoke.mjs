import { runSqlSmoke } from "../../../commands/smoke/sql.mjs";

export function runPrimarySqlSmoke({ client, emit, config, dependencies }) {
  return runSqlSmoke({
    client,
    createLive: dependencies.createLiveDb,
    createDb: dependencies.createDb,
    emit,
    config,
  });
}
