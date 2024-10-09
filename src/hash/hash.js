import * as fs from 'fs/promises';
import path from 'node:path';
import { homedir } from 'node:os';
import { InvalidInputError } from '../error/erorr.js';
import { log } from '../utils/utils.js';
import { createReadStream } from 'node:fs';
const { createHash } = await import('node:crypto');

export async function hash(currentDir, args) {
  const argmnts = args;
  const home = homedir();
  const pathToFileArg = argmnts.shift();

  if (!pathToFileArg) throw new InvalidInputError('Argument `path_to_file` is missed');
  if (argmnts.length > 0) throw new InvalidInputError('Too much arguments for operation');

  const pathToFile = path.resolve(currentDir, pathToFileArg);

  if (!pathToFile.startsWith(home)) {
    log.blue(`It's prohibited to go upper than home directory: ${home}`);

    return;
  }

  await fs.access(pathToFile);
  const stats = await fs.stat(pathToFile);

  if (!stats.isFile()) throw Error(`The path '${pathToFile}' is not a file`);

  const hash = createHash('sha256');
  const rStream = createReadStream(pathToFile);
  const res = rStream.pipe(hash).digest('hex');

  return res;
}
