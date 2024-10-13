import * as fs from 'fs/promises';
import path from 'node:path';
import { checkArguments, checkOutOfHomePath } from '../error/erorr.js';
import { checkIsDirectory } from '../utils/utils.js';

export async function ls(directory, args) {
  checkArguments(args, []);

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

  return { table: result };
}

export async function cd(currentDir, args) {
  checkArguments(args, [{ name: 'path_to_directory' }]);

  const pathToDir = path.resolve(currentDir, args[0]);

  checkOutOfHomePath(pathToDir);

  await checkIsDirectory(pathToDir);

  return { newDir: pathToDir };
}

export async function up(currentDir, args) {
  checkArguments(args, []);

  return cd(currentDir, ['..']);
}
