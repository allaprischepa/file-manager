import { InvalidInputError } from "../error/erorr.js";
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';
import * as fs from 'node:fs/promises';
import path from 'node:path';
import { createReadStream, createWriteStream } from "node:fs";

export async function compress(currentDir, args) {
  try {
    const argmnts = args;
    const sourcePathArg = argmnts.shift();
    const destinationPathArg = argmnts.shift();

    if (argmnts.length > 0) throw new InvalidInputError('Too much arguments for operation');
    if (!sourcePathArg) throw new InvalidInputError('Arguments `path_to_file` and `path_to_destination` are missed');
    if (!destinationPathArg) throw new InvalidInputError('Argument `path_to_destination` is missed');

    const sourcePath = path.resolve(currentDir, sourcePathArg);
    const destPath = path.resolve(currentDir, destinationPathArg);

    await fs.access(sourcePath);
    const stats = await fs.stat(sourcePath);

    if (!stats.isFile()) throw Error(`The path '${sourcePath}' is not a file`);

    // If destination contains not existing folders
    const dirPath = path.dirname(destPath);
    await fs.mkdir(dirPath, { recursive: true });

    const source = createReadStream(sourcePath);
    const destination = createWriteStream(destPath);
    const brotliCompress = createBrotliCompress();

    source.pipe(brotliCompress).pipe(destination);
  } catch(err) {
    throw err;
  }
}

export async function decompress(currentDir, args) {
  try {
    const argmnts = args;
    const sourcePathArg = argmnts.shift();
    const destinationPathArg = argmnts.shift();

    if (argmnts.length > 0) throw new InvalidInputError('Too much arguments for operation');
    if (!sourcePathArg) throw new InvalidInputError('Arguments `path_to_file` and `path_to_destination` are missed');
    if (!destinationPathArg) throw new InvalidInputError('Argument `path_to_destination` is missed');

    const sourcePath = path.resolve(currentDir, sourcePathArg);
    const destPath = path.resolve(currentDir, destinationPathArg);

    await fs.access(sourcePath);
    const stats = await fs.stat(sourcePath);

    if (!stats.isFile()) throw Error(`The path '${sourcePath}' is not a file`);

    // If destination contains not existing folders
    const dirPath = path.dirname(destPath);
    await fs.mkdir(dirPath, { recursive: true });

    const source = createReadStream(sourcePath);
    const destination = createWriteStream(destPath);
    const brotliDecompress = createBrotliDecompress();

    source.pipe(brotliDecompress).pipe(destination);
  } catch(err) {
    throw err;
  }
}
