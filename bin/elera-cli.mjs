#!/usr/bin/env node
import { runCli } from "../src/cli/main.mjs";
import pkg from "../package.json" with { type: "json" };
const { version } = pkg;

if (process.argv.includes("--version")) {
  console.log(version);
  process.exit(0);
}
import { log, registerHandlers } from "@eliware/common";

const handlers = registerHandlers({
  log,
  events: ["uncaughtException", "unhandledRejection", "warning"],
});
process.exitCode = await runCli();
handlers.removeHandlers();
