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

  await fs.writeFile(filePath, '', { flag: 'wx' });

  return { res: `The file ${filePath} is added`};
}

export async function rn(currentDir, args) {
  checkArguments(args, [{ name: 'path_to_file'}, { name: 'new_file_name' }]);

  const oldPath = path.resolve(currentDir, args[0]);

  await checkIsFile(oldPath);

  const newFileName = args[1];

  checkIsValidFilename(newFileName);

  const newPath = path.join(path.dirname(oldPath), newFileName);

  const oldPathAccess = await fs.access(oldPath, fs.constants.F_OK).catch((err) => { return err });
  const newPathAccess = await fs.access(newPath, fs.constants.F_OK).catch((err) => { return err });

  if (oldPathAccess instanceof Error) throw oldPathAccess;
  if (!(newPathAccess instanceof Error)) throw Error(`File ${newPath} already exists`);

  await fs.rename(oldPath, newPath);

  return { res: `The file ${oldPath} is renamed into ${newFileName}` };
}

export async function rm(currentDir, args) {
  checkArguments(args, [{ name: 'path_to_file' }]);

  const filePath = path.resolve(currentDir, args[0]);

  await checkIsFile(filePath);

  await fs.unlink(filePath);

  return { res: `The file ${filePath} is removed `};
}