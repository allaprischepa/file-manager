import { homedir } from 'node:os';
import { getUsernameFromArgs } from './src/user/user.js';
import { stdin  } from 'node:process';
import { cd, ls } from './src/nwd/nwd.js';

const username = getUsernameFromArgs();
let currentDir = homedir();
const displayWelcomeMsg = () => console.log('\x1b[36m%s\x1b[0m', `Welcome to the File Manager, ${username}!`);
const displayCurrentDir = () => console.log('You are currently in \x1b[34m%s\x1b[0m', currentDir);
const displayByeMsg = () => console.log('\x1b[36m%s\x1b[0m', `Thank you for using File Manager, ${username}, goodbye!`)

displayWelcomeMsg();
displayCurrentDir();

stdin.setEncoding('utf-8');
stdin.on('data', async (input) => {
  const [op, ...args] = input.trim().split(' ');

  if (op === '.exit') process.exit(0);

  try {
    switch(op) {
      case 'cd': {
        const res = await cd(currentDir, args);
        currentDir = res;
        break;
      }
      case 'ls': {
        const res = await ls(currentDir);
        console.table(res);
        break;
      }
      default: {
        console.log('Unknown operation');
      }
    }
  } catch(err) {
    console.log('\x1b[31m%s\x1b[0m', `Invalid input. Error: ${err.message}`);
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
    console.log(`Something went wrong. Error code: ${code}`);
  }
});
