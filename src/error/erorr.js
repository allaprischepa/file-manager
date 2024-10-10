import { log } from "../utils/utils.js";
import { EOL, homedir } from 'node:os';

export class InvalidInputError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class OutOfHomeError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

export function handleError(err) {
  if (err instanceof OutOfHomeError) {
    log.blue(err.message);
  }
  else {
    let prefix = err instanceof InvalidInputError ? 'Invalid input' : 'Operation failed';

    log.red(`${prefix}. Reason: ${err.message}`);
  }
}

export function checkArguments(args, requiredArgs) {
  if (args.length === requiredArgs.length) {
    let msg = [];

    // Check possible options for arguments.
    for (let i = 0; i < args.length; i++) {
      const possibleArgs = requiredArgs[i].possibleArgs;
      if (possibleArgs && possibleArgs.length > 0 && !possibleArgs.includes(args[i])) {
        msg.push(`Possible arguments for ${requiredArgs[i].name} are: ${requiredArgs[i].possibleArgs.join(', ')}`);
      }
    }

    if (msg.length > 0) throw new InvalidInputError(msg.join(EOL));

    return;
  }

  if (args.length > requiredArgs.length) throw new InvalidInputError('Too much arguments for operation');
  if (args.length < requiredArgs.length) {
    const missedArgs = requiredArgs.slice(args.length).map((argmnt) => argmnt.name);
    throw new InvalidInputError(`The following arguments are missed: ${missedArgs.join(', ')}`);
  }
}

export function checkOutOfHomePath(pathToCheck) {
  if (!pathToCheck.startsWith(homedir())) {
    throw new OutOfHomeError(`Path ${pathToCheck} is upper than home directory`);
  }
}
