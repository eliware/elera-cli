export const manifestText = (entries) => `${entries.map(({ hash, name }) => `${hash}  ${name}`).join('\n')}\n`;
