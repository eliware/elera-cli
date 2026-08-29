import { expect, jest, test } from '@jest/globals';
import { syncToNas, withRetry } from '../../src/transport/nas.mjs';

test('syncs files through staged SSH upload and finalization', async () => {
  const commands = []; const upload = jest.fn(); const close = jest.fn(); const sshRun = jest.fn(async ({ commands: values }) => { commands.push(...values); return [{ code: 0 }]; });
  const result = await syncToNas({ localPath: 'local', remotePath: '/nas/1', sshOptions: { host: 'nas' }, rotateCommand: 'rotate', sshRun, sshConnect: async () => ({ upload, close }), list: async () => [{ name: 'app.sql.gz', isFile: () => true }, { name: 'dir', isFile: () => false }], stagePath: '/nas/stage' });
  expect(result).toBe('/nas/1'); expect(upload).toHaveBeenCalledWith('local/app.sql.gz', '/nas/stage/app.sql.gz'); expect(close).toHaveBeenCalled(); expect(commands.join(' ')).toContain('sha256sum');
});

test('supports dry runs, retries, and notifies on permanent failures', async () => {
  expect(await syncToNas({ localPath: 'x', remotePath: 'r', dryRun: true })).toBe('r'); let attempts = 0; await expect(withRetry(async () => { attempts += 1; if (attempts < 2) throw new Error('retry'); return 'ok'; }, { attempts: 2, delayMs: 1 })).resolves.toBe('ok');
  const notify = jest.fn(); await expect(syncToNas({ localPath: 'x', remotePath: 'r', sshOptions: {}, rotateCommand: 'rotate', sshRun: async () => [{ code: 1 }], retry: async (operation) => operation(), notify })).rejects.toThrow('preparation'); expect(notify).toHaveBeenCalledWith('remote staging preparation failed');
});
test('handles optional staging and upload/finalization failures', async () => {
  const upload = jest.fn(async () => { throw new Error('upload failed'); }); const notify = jest.fn();
  await expect(syncToNas({ localPath: 'x', remotePath: 'r', sshOptions: {}, rotateCommand: 'rotate', prepareRemote: false, finalizeRemote: false, sshConnect: async () => ({ upload, close: async () => {} }), list: async () => ['file'], retry: async (operation) => operation(), notify })).rejects.toThrow('upload failed');
  await expect(withRetry(async () => { throw new Error('all failed'); }, { attempts: 1 })).rejects.toThrow('all failed');
  await expect(syncToNas({ localPath: 'x', remotePath: 'r', sshOptions: {}, rotateCommand: 'rotate', finalizeRemote: true, sshRun: async ({ commands }) => commands[0].startsWith('rm') ? [{ code: 0 }] : [{ code: 2 }], sshConnect: async () => ({ upload: async () => {}, close: async () => {} }), list: async () => [], retry: async (operation) => operation(), notify })).rejects.toThrow('finalization');
  expect(notify).toHaveBeenCalled();
});
test('handles non-Error NAS failures and default notification', async () => {
  await expect(syncToNas({ localPath: 'x', remotePath: 'r', sshOptions: {}, rotateCommand: 'rotate', retry: async () => { throw 'raw nas failure'; } })).rejects.toBe('raw nas failure');
});
test('accepts successful SSH results without a status code', async () => {
  await expect(syncToNas({ localPath: 'x', remotePath: 'r', sshOptions: {}, rotateCommand: 'rotate', sshRun: async () => [{}], sshConnect: async () => ({ upload: async () => {}, close: async () => {} }), list: async () => [], retry: async (operation) => operation() })).resolves.toBe('r');
});
test('prepares staging while allowing finalization to be disabled', async () => {
  await expect(syncToNas({ localPath: 'x', remotePath: 'r', sshOptions: {}, rotateCommand: 'rotate', finalizeRemote: false, sshRun: async () => [{}], sshConnect: async () => ({ upload: async () => {}, close: async () => {} }), list: async () => [], retry: async (operation) => operation() })).resolves.toBe('r');
});
