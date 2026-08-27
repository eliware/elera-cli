#!/usr/bin/env node
import { createDbFromEnvironment } from './index.mjs';

if (process.argv.includes('--help')) {
  process.stdout.write('galera-cli — Galera database operations\n');
} else if (process.argv.includes('--version')) {
  process.stdout.write('0.1.0\n');
} else {
  process.stdout.write('galera-cli is not yet configured with an operation\n');
}

export { createDbFromEnvironment };
