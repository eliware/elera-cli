import { createWriteStream } from "node:fs";
import { createGzip } from "node:zlib";
import { spawn } from "node:child_process";
import { pipeline } from "node:stream/promises";

export function dumpToGzip(
  binary,
  args,
  destination,
  { spawnImpl = spawn, createOutput = createWriteStream, gzip = createGzip } = {},
) {
  return new Promise((resolve, reject) => {
    const controller = new AbortController();
    let settled = false;
    const fail = (error) => {
      if (settled) return;
      settled = true;
      controller.abort();
      reject(error);
    };
    let child;
    try {
      child = spawnImpl(binary, args, { shell: false, stdio: ["ignore", "pipe", "pipe"] });
    } catch (error) {
      fail(error);
      return;
    }
    let stderr = "";
    child.stderr.setEncoding("utf8");
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    const exited = new Promise((done, rejectExit) =>
      child.once("close", (code) =>
        code === 0 ? done() : rejectExit(new Error(stderr.trim() || `dump exited with ${code}`)),
      ),
    );
    Promise.all([
      pipeline(child.stdout, gzip(), createOutput(destination), { signal: controller.signal }),
      exited,
    ]).then(() => {
      settled = true;
      resolve();
    }, fail);
    child.once("error", fail);
  });
}
