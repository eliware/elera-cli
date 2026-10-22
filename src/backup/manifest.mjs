export function parseBackupManifest(databaseContent, checksumContent) {
  const databases = databaseContent.split(/\r?\n/).filter(Boolean);
  const hashes = new Map(
    checksumContent
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => {
        const [value, name] = line.trim().split(/\s+/, 2);
        return [name, value];
      }),
  );
  return { databases, hashes };
}

export function hasBackupManifest(manifest, databases = manifest.databases) {
  return databases.length > 0 && databases.every((name) => manifest.hashes.has(`${name}.sql.gz`));
}
