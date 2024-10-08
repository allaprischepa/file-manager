const reset = "\x1b[0m";

export const log = {
  red: (text) => console.log("\x1b[31m" + text + reset),
  green: (text) => console.log("\x1b[32m" + text + reset),
  yellow: (text) => console.log("\x1b[33m" + text + reset),
  blue: (text) => console.log("\x1b[34m" + text + reset),
  magenta: (text) => console.log("\x1b[35m" + text + reset),
};
