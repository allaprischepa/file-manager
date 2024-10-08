import { parseArgs } from 'node:util';

export const getUsernameFromArgs = () => {
  let username = 'stranger';

  try {
    const options = { username: { type: 'string' } };
    const { values } = parseArgs({ options, strict: false });

    if (typeof values.username === 'string') username = values.username;
  } catch (err) {}

  return username;
}
