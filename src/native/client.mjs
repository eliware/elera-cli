import { spawn } from "node:child_process";

const defaultFileOptions = new Set(["--defaults-file", "--defaults-extra-file"]);

function connectionArguments(args, connection) {
  const injected = [
    "--host",
    connection.host,
    "--port",
    String(connection.port),
    "--user",
    connection.username,
  ];
  const optionIndex = args.findIndex(
    (argument) =>
      defaultFileOptions.has(argument) ||
      [...defaultFileOptions].some((option) => argument.startsWith(`${option}=`)),
  );
  if (optionIndex === -1) return [...injected, ...args];
  const afterDefault = args[optionIndex].includes("=") ? optionIndex + 1 : optionIndex + 2;
  return [...args.slice(0, afterDefault), ...injected, ...args.slice(afterDefault)];
}

export function runNativeClient({
  binary,
  args,
  connection,
  environment = process.env,
  spawnImpl = spawn,
}) {
  if (
    typeof binary !== "string" ||
    !binary ||
    !Array.isArray(args) ||
    !connection ||
    typeof connection.host !== "string" ||
    !connection.host ||
    !Number.isInteger(Number(connection.port)) ||
    typeof connection.username !== "string" ||
    !connection.username ||
    typeof connection.password !== "string"
  )
    throw new TypeError("native SQL connection details are incomplete");
  const child = spawnImpl(binary, connectionArguments(args, connection), {
    env: { ...environment, MYSQL_PWD: connection.password },
    stdio: "inherit",
    windowsHide: true,
  });
  return new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("close", (code) => resolve(code ?? 1));
  });
}
