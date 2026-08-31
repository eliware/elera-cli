export const applicationDatabases = (databases) => databases.filter((name) => !['information_schema', 'performance_schema', 'mysql', 'sys'].includes(name));
