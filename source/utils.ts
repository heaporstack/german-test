import {createInterface} from "node:readline";
import {stdin, stdout} from "node:process";

export function hasValue<T>(variable: T | null | undefined): variable is T {
  return variable !== null && variable !== undefined;
}

export function deepCopy<T>(variable: T): T {
  return JSON.parse(JSON.stringify(variable))
}

/** Returns a random generated integer between min and max. (max excluded) */
export function randomInteger(min: number, max: number): number {
  if (!Number.isSafeInteger(min) || !Number.isSafeInteger(max)) {
    throw new RangeError(`${min} or ${max} is not a safe integer`);
  }
  return Math.floor(Math.random() * (max - min) + min);
}

export function mixArray<T>(arr: Array<T>): Array<T> {
  const cpy = deepCopy(arr);
  for (let i = 0; i < cpy.length; ++i) {
    const idx = randomInteger(0, cpy.length);
    [cpy[i], cpy[idx]] = [cpy[idx], cpy[i]];
  }
  return cpy;
}

export async function readLine(prompt: string): Promise<string> {
  const rl = createInterface({
    input: stdin,
    output: stdout
  });
  return new Promise((resolve, reject) => {
    rl.question(prompt, (answer: string) => {
      rl.close();
      resolve(answer);
    });
  });
}
