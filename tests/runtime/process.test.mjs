import { expect, test } from '@jest/globals';
import { runProcess } from '../../src/runtime/process.mjs';
import process from 'node:process';

test('runs a successful process and captures both streams', async () => { await expect(runProcess(process.execPath, ['-e', "process.stdout.write('ok'); process.stderr.write('note')"])).resolves.toEqual({ stdout: 'ok', stderr: 'note' }); });
test('rejects process errors, non-zero exits, and missing binaries', async () => { await expect(runProcess(process.execPath, ['-e', 'process.exit(3)'])).rejects.toThrow('exited with 3'); await expect(runProcess('elera-command-that-does-not-exist', [])).rejects.toThrow(); });
