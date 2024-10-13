import { checkArguments } from "../error/erorr.js";
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
  const osOperation = {
    '--EOL': { res: JSON.stringify(nOs.EOL) },
    '--cpus': cpus(),
    '--homedir': { res: nOs.homedir() },
    '--username': { res: nOs.userInfo().username },
    '--architecture': { res: nOs.arch() },
  };

  checkArguments(args, [{ name: 'option', possibleArgs: Object.keys(osOperation)}]);

  return osOperation[args[0]];
}
