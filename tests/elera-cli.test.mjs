import { readFile } from 'node:fs/promises';
test('defines the executable CLI entrypoint', async () => {
  const source = await readFile(new URL('../src/elera-cli.mjs', import.meta.url), 'utf8');
  expect(source).toContain("runCli()");
});
