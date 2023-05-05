import {readFileSync} from "node:fs";
import {hasValue, deepCopy, randomInteger, mixArray, readLine} from "./utils";

interface IWord {
  readonly fr: string;
  readonly de: string;
}

interface IWordCount extends IWord {
  count: number;
}

// list of words with de / fr translations
const words: Array<IWordCount> = JSON.parse(readFileSync("./source/words.json").toString()).map((word: IWord) => {
  return {
    ...word,
    count: 0
  } as IWordCount;
});

// list of words suggestions
const suggestions = words.map((word: IWordCount) => word.de);

function randomSuggestions(suggestions: Array<string>, suggestionsCount: number, solution?: string): Array<string> {
  if (!Number.isSafeInteger(suggestionsCount)) {
    throw new RangeError(`${suggestionsCount} is not a safe integer`);
  }
  if (suggestionsCount <= 0) {
    return [];
  }
  let arr = new Array<string>();
  let cnt = suggestionsCount - 1;
  let mustThrow = false;
  if (hasValue(solution)) {
    if (!suggestions.includes(solution)) {
      if (suggestionsCount > suggestions.length + 1) {
        mustThrow = true;
      }
    } else {
      if (suggestionsCount > suggestions.length) {
        mustThrow = true;
      }
    }
    arr.push(solution);
  } else {
    if (suggestionsCount > suggestions.length) {
      mustThrow = true;
    }
    cnt = suggestionsCount;
  }
  if (mustThrow) {
    throw new RangeError("Each element of the output array must appear only once");
  }

  for (let i = 0; i < cnt; ++i) {
    let newWord = "";
    while (true) {
      let idx = randomInteger(0, suggestions.length);
      newWord = suggestions[idx];
      if (!arr.includes(newWord) && newWord !== solution) break;
    }
    arr.push(newWord);
  }
  for (let i = 0; i < 10; ++i) {
    arr = mixArray(arr);
  }
  return arr;
}

async function oneTurn(words: Array<IWordCount>): Promise<number> {
  const word = words[randomInteger(0, words.length)];
  let user;
  if (word.count < 1) {
    const sg = randomSuggestions(suggestions, 4, word.de);
    const map = sg.reduce((acc, a, idx) => {
      if (idx < 1) return a;
      return `${acc}, ${a}`;
    });
    user = await readLine(`Traduisez "${word.fr}" en Allemand (Suggestions: ${map}) `);
  } else {
    user = await readLine(`Traduisez "${word.fr}" en Allemand : `);
  }
  if (user === word.de) {
    ++word.count;
    await readLine("\x1b[32mCorrect\x1b[0m");
    return 0; // correct
  } else if (user === ".exit") {
    return 2; // exit
  }
  await readLine("\x1b[31mIncorrect\x1b[0m");
  return 1; // incorrect
}

async function main(turns: number) {
  if (turns < 1) return;
  let score = 0;
  let counter = 0;
  for (counter = 0; counter < turns; ++counter) {
    console.clear();
    if (counter === 0) console.log("Vous pouvez quitter le programme en tapant \".exit\"");
    const user = await oneTurn(words);
    if (user === 0) ++score;
    if (user === 2) break;
  }
  console.clear();
  if (score / counter < 0.33) {
    console.log(`\x1b[31mScore : ${score} / ${counter}\x1b[0m`);
  } else if (score / counter < 0.66) {
    console.log(`\x1b[33mScore : ${score} / ${counter}\x1b[0m`);
  } else {
    console.log(`\x1b[32mScore : ${score} / ${counter}\x1b[0m`);
  }
}

main(30);
