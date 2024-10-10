import path from 'node:path';
import { checkArguments, checkOutOfHomePath } from '../error/erorr.js';
import { createReadStream } from 'node:fs';
import { checkIsFile } from '../utils/utils.js';
const { createHash } = await import('node:crypto');

export async function hash(currentDir, args) {
  checkArguments(args, [{ name: 'path_to_file' }]);

  const pathToFile = path.resolve(currentDir, args[0]);

  checkOutOfHomePath(pathToFile);

  await checkIsFile(pathToFile);

  const hash = createHash('sha256');
  const rStream = createReadStream(pathToFile);
  const res = rStream.pipe(hash).digest('hex');

  return res;
}