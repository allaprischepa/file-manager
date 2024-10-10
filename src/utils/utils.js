import * as fs from 'node:fs/promises';

const reset = "\x1b[0m";

export const log = {
  red: (text) => console.log("\x1b[31m" + text + reset),
  green: (text) => console.log("\x1b[32m" + text + reset),
  yellow: (text) => console.log("\x1b[33m" + text + reset),
  blue: (text) => console.log("\x1b[34m" + text + reset),
  magenta: (text) => console.log("\x1b[35m" + text + reset),
};

export async function checkIsFile(pathToFile) {
  await fs.access(pathToFile);
  const stats = await fs.stat(pathToFile);

  if (!stats.isFile()) throw Error(`The path '${pathToFile}' is not a file`);
}

export async function checkIsDirectory(pathToDir) {
  await fs.access(pathToDir);
  const stats = await fs.stat(pathToDir);

  if (!stats.isDirectory()) throw Error(`The path '${pathToDir}' is not a folder`);
}
