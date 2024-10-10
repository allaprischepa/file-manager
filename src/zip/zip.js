import { checkArguments } from "../error/erorr.js";
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';
import * as fs from 'node:fs/promises';
import path from 'node:path';
import { createReadStream, createWriteStream } from "node:fs";
import { checkIsFile } from "../utils/utils.js";

export async function compress(currentDir, args, reverse = false) {
  checkArguments(args, [{ name: 'path_to_file' }, { name: 'path_to_destination' }]);

  const sourcePath = path.resolve(currentDir, args[0]);
  const destPath = path.resolve(currentDir, args[1]);

  await checkIsFile(sourcePath);

  // If destination contains not existing folders
  const dirPath = path.dirname(destPath);
  await fs.mkdir(dirPath, { recursive: true });

  const source = createReadStream(sourcePath);
  const destination = createWriteStream(destPath);
  const brotli = reverse ? createBrotliDecompress() : createBrotliCompress();

  source.pipe(brotli).pipe(destination);
}

export async function decompress(currentDir, args) {
  await compress(currentDir, args, true);
}
