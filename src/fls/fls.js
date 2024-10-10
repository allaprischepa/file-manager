import { stdout } from 'node:process';
import { checkArguments, checkOutOfHomePath } from '../error/erorr.js';
import { checkIsFile, checkIsValidFilename } from '../utils/utils.js';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import * as fs from 'fs/promises';

export async function cat(currentDir, args) {
  checkArguments(args, [{ name: 'path_to_file' }]);

  const pathToFile = path.resolve(currentDir, args[0]);

  checkOutOfHomePath(pathToFile);

  await checkIsFile(pathToFile);

  const source = createReadStream(pathToFile);

  return new Promise((resolve, reject) => {
    source.pipe(stdout);

    source.on('end', () => resolve());

    source.on('error', (err) => reject(err));
  });
}

export async function add(currentDir, args) {
  checkArguments(args, [{ name: 'new_file_name' }]);

  const newFileName = args[0];

  checkIsValidFilename(newFileName);

  const filePath = path.join(currentDir, newFileName);

  await fs.writeFile(filePath, '');
}

export async function rn(currentDir, args) {
  checkArguments(args, [{ name: 'path_to_file'}, { name: 'new_file_name' }]);

  const oldPath = path.resolve(currentDir, args[0]);

  await checkIsFile(oldPath);

  const newFileName = args[1];

  checkIsValidFilename(newFileName);

  const newPath = path.join(path.dirname(oldPath), newFileName);

  await fs.rename(oldPath, newPath);
}

export async function rm(currentDir, args) {
  checkArguments(args, [{ name: 'path_to_file' }]);

  const filePath = path.resolve(currentDir, args[0]);

  await checkIsFile(filePath);

  await fs.unlink(filePath);
}
