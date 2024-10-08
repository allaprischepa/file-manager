import { log } from "../utils/utils.js";

export class InvalidInputError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

export function handleError(err) {
  let prefix = 'Operation failed';
  if (err instanceof InvalidInputError) prefix = 'Invalid input';

  log.red(`${prefix}. Error: ${err.message}`);
}
