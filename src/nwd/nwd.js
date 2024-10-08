import * as fs from 'fs/promises';
import path from 'node:path';
import { homedir } from 'node:os';
import { InvalidInputError } from '../error/erorr.js';
import { log } from '../utils/utils.js';

export async function ls(directory, args) {
  try {
    if (args.length > 0) throw new InvalidInputError('Redundant arguments');

    const items = await fs.readdir(directory);
    const files = [];
    const folders = [];

    for (const item of items) {
      const itemPath = path.join(directory, item);
      const stats = await fs.stat(itemPath);

      if (stats.isDirectory()) {
        folders.push(item);
      } else if (stats.isFile()) {
        files.push(item);
      }
    }

    folders.sort();
    files.sort();

    const result = [
      ...folders.map((folder) => { return { name: folder, type: 'directory' } }),
      ...files.map((file) => { return { name: file, type: 'file' } }),
    ];

    return result;
  } catch (err) {
    throw err;
  }
}

export async function cd(currentDir, args) {
  try {
    const argmnts = args;
    const home = homedir();
    const pathToDirArg = argmnts.shift();

    if (!pathToDirArg) throw new InvalidInputError('Argument `path_to_directory` is missed');
    if (argmnts.length > 0) throw new InvalidInputError('Too much arguments for operation');

    const pathToDir = path.resolve(currentDir, pathToDirArg);

    if (!pathToDir.startsWith(home)) {
      log.blue(`It's prohibited to go upper than home directory: ${home}`);

      return currentDir;
    }

    await fs.access(pathToDir);
    const stats = await fs.stat(pathToDir);

    if (!stats.isDirectory()) throw Error(`The path '${pathToDir}' is not a folder`);

    return pathToDir;
  } catch(err) {
    throw err;
  }
}

export async function up(currentDir, args) {
  try {
    if (args.length > 0) throw new InvalidInputError('Redundant arguments');

    return cd(currentDir, ['..']);
  } catch(err) {
    throw err;
  }
}
