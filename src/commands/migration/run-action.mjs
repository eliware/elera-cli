import { migrationWorkflows } from "./workflows.mjs";
import { runMigrationWorkflow } from "./run-workflow.mjs";
export async function runMigrationAction({ client, emit, action, input = {} }) {
  const workflow = migrationWorkflows[action];
  if (!workflow) throw new Error(`unsupported migration action: ${action}`);
  return runMigrationWorkflow({ client, emit, workflow, input });
}
