import { homedir } from 'node:os';
import { displayWelcomeMsg, displayByeMsg } from './src/user/user.js';
import { stdin } from 'node:process';
import { cd, ls, up } from './src/nwd/nwd.js';
import { handleError, InvalidInputError } from './src/error/erorr.js';
import { log } from './src/utils/utils.js';
import { os } from './src/os/os.js';
import { hash } from './src/hash/hash.js';
import { compress, decompress } from './src/zip/zip.js';
import { add, cat, rm, rn } from './src/fls/fls.js';

let currentDir = homedir();
const displayCurrentDir = () => log.magenta(`You are currently in ${currentDir}`);

displayWelcomeMsg();
displayCurrentDir();

stdin.setEncoding('utf-8');
stdin.on('data', async (input) => {
  const [op, ...args] = input.trim().split(' ');

  if (op === '.exit') process.exit(0);

  const ops = {
    'up': () => up(currentDir, args),
    'cd': () => cd(currentDir, args),
    'ls': () => ls(currentDir, args),
    'cat': () => cat(currentDir, args),
    'add': () => add(currentDir, args),
    'rn': () => rn(currentDir, args),
    'rm': () => rm(currentDir, args),
    'os': () =>  os(args),
    'hash': () => hash(currentDir, args),
    'compress': () => compress(currentDir, args),
    'decompress': () => decompress(currentDir, args),
  }

  try {
    if (op in ops) {
      const { newDir, res, table } = await ops[op]() || {};

      if (newDir) currentDir = newDir;
      if (res) console.log(res);
      if (table) console.table(table);
    } else {
      throw new InvalidInputError(`Unknown operation: ${op}`);
    }
  } catch(err) {
    handleError(err);
  }

  displayCurrentDir();
});

// Finish on Ctrl + C.
process.on('SIGINT', () => {
  process.exit(0);
});

// Finish the process.
process.on('exit', code => {
  if (code === 0) {
    displayByeMsg();
  } else {
    log.red(`Something went wrong. Error code: ${code}`);
  }
});
