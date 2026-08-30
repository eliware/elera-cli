test('exposes the CLI package contract without client internals', async () => {
  const subject = await import('../src/index.mjs?coverage=1');
  expect(subject.createDb).toBeUndefined();
  expect(subject.createDbFromBundle).toBeUndefined();
});
