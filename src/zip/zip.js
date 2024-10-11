import { checkArguments, checkOutOfHomePath } from "../error/erorr.js";
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';
import * as fs from 'node:fs/promises';
import path from 'node:path';
import { createReadStream, createWriteStream } from "node:fs";
import { checkIsFile } from "../utils/utils.js";
import { pipeline } from "node:stream/promises";

export async function compress(currentDir, args, reverse = false) {
  checkArguments(args, [{ name: 'path_to_file' }, { name: 'path_to_destination' }]);

  const sourcePath = path.resolve(currentDir, args[0]);
  const destPath = path.resolve(currentDir, args[1]);

  checkOutOfHomePath(sourcePath);
  checkOutOfHomePath(destPath);

  await checkIsFile(sourcePath);

  // If destination contains not existing folders
  const dirPath = path.dirname(destPath);
  await fs.mkdir(dirPath, { recursive: true });

  const source = createReadStream(sourcePath);
  const destination = createWriteStream(destPath, { flags: 'wx'});
  const brotli = reverse ? createBrotliDecompress() : createBrotliCompress();

  await pipeline(source, brotli, destination);

  return { res: `The file ${sourcePath} is ${reverse ? 'de' : ''}compressed into ${destPath}`};
}

export async function decompress(currentDir, args) {
  return compress(currentDir, args, true);
}
