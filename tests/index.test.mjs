test('exposes the public package contract', async () => {
  const subject = await import('../src/index.mjs?coverage=1');
  expect(subject.createDb).toBeDefined();
  expect(subject.createDbFromEnvironment).toBeDefined();
});
