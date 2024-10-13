import { parseArgs } from 'node:util';
import { log } from '../utils/utils.js';

export const getUsernameFromArgs = () => {
  let username = 'stranger';

  try {
    const options = { username: { type: 'string' } };
    const { values } = parseArgs({ options, strict: false });

    if (typeof values.username === 'string') username = values.username;
  } catch (err) {}

  return username;
}

const username = getUsernameFromArgs();
export const displayWelcomeMsg = () => log.yellow(`Welcome to the File Manager, ${username}!`);
export const displayByeMsg = () => log.yellow(`Thank you for using File Manager, ${username}, goodbye!`);
