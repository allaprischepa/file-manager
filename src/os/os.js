import { InvalidInputError } from "../error/erorr.js";
import * as nOs from 'os';

function cpus() {
  const cpusArr = nOs.cpus();

  return {
    res: `Total amount of CPUS: ${cpusArr.length}`,
    table: cpusArr.length > 0 && cpusArr.map((cpu) => {
      return {
        'Model': cpu.model,
        'Clock rate (in GHz)': cpu.speed / 1000
      };
    })
  }
}

export function os(args) {
  try {
    const osOperation = {
      '--EOL': { res: nOs.EOL },
      '--cpus': cpus(),
      '--homedir': { res: nOs.homedir() },
      '--username': { res: nOs.userInfo().username },
      '--architecture': { res: nOs.arch() },
    };
    const possibleArgs = Object.keys(osOperation);
    const argmnts = args;
    const arg = argmnts.shift();

    if (!arg) throw new InvalidInputError(`Argument is missed. Possible arguments are: ${possibleArgs}`);
    if (argmnts.length > 0) throw new InvalidInputError('Too much arguments for operation');
    if (!possibleArgs.includes(arg)) throw new InvalidInputError(`Argument '${arg}' is not supported. Possible arguments are: ${possibleArgs}`);

    return osOperation[arg];
  } catch(err) {
    throw err;
  }
}
