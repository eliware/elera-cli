export function verificationDatabase(database, prefix) {
  const name = `${prefix}${database}`;
  return {
    name,
    drop: `DROP DATABASE IF EXISTS \`${name}\``,
    create: `CREATE DATABASE \`${name}\``,
  };
}
