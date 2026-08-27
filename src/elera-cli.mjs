#!/usr/bin/env node
import { runCli } from './cli/main.mjs';
import { log, registerHandlers } from '@eliware/common';

const handlers = registerHandlers({ log, events: ['uncaughtException', 'unhandledRejection', 'warning'] });
process.exitCode = await runCli();
handlers.removeHandlers();
