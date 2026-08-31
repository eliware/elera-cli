const quote = (value) => `'${String(value).replaceAll("'", "'\\''")}'`;

export async function prepareStaging({ sshOptions, stagePath, sshRun }) {
  const results = await sshRun({ ...sshOptions, commands: [`rm -rf -- ${quote(stagePath)}`, `mkdir -p -- ${quote(stagePath)}`] });
  if (results.some((result) => result.code && result.code !== 0)) throw new Error('remote staging preparation failed');
}

export async function finalizeStaging({ sshOptions, stagePath, remotePath, rotateCommand, sshRun }) {
  const results = await sshRun({ ...sshOptions, commands: [`cd ${quote(stagePath)} && sha256sum -c SHA256SUMS`, rotateCommand, `mv -- ${quote(stagePath)} ${quote(remotePath)}`] });
  if (results.some((result) => result.code && result.code !== 0)) throw new Error('remote backup finalization failed');
}
