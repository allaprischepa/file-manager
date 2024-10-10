import { homedir } from 'node:os';
import { displayWelcomeMsg, displayByeMsg } from './src/user/user.js';
import { stdin  } from 'node:process';
import { cd, ls, up } from './src/nwd/nwd.js';
import { handleError, InvalidInputError } from './src/error/erorr.js';
import { log } from './src/utils/utils.js';
import { os } from './src/os/os.js';
import { hash } from './src/hash/hash.js';
import { compress, decompress } from './src/zip/zip.js';

let currentDir = homedir();
const displayCurrentDir = () => log.magenta(`You are currently in ${currentDir}`);

displayWelcomeMsg();
displayCurrentDir();

stdin.setEncoding('utf-8');
stdin.on('data', async (input) => {
  const [op, ...args] = input.trim().split(' ');

  if (op === '.exit') process.exit(0);

  try {
    switch(op) {
      case 'up': {
        const res = await up(currentDir, args);
        if (res) currentDir = res;
        break;
      }
      case 'cd': {
        const res = await cd(currentDir, args);
        if (res) currentDir = res;
        break;
      }
      case 'ls': {
        const res = await ls(currentDir, args);
        if (res) console.table(res);
        break;
      }
      case 'os': {
        const { res, table } = os(args);
        if (res) console.log(res);
        if (table) console.table(table);
        break;
      }
      case 'hash': {
        const res = await hash(currentDir, args);
        if (res) console.log(res);
        break;
      }
      case 'compress': {
        await compress(currentDir, args);
        break;
      }
      case 'decompress': {
        await decompress(currentDir, args);
        break;
      }
      default: {
        throw new InvalidInputError('Unknown operation');
      }
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
