import run from "../deps.ts";
import * as utils from "../utils.ts";

const numbers = {
  "one": "1",
  "two": "2",
  "three": "3",
  "four": "4",
  "five": "5",
  "six": "6",
  "seven": "7",
  "eight": "8",
  "nine": "9"
}

const parseInput = (rawInput: string) => {
  return rawInput.trim().split("\n").map((line) => {
    return line.split("").filter(a => /\d/.test(a)).map(n => parseInt(n));
  });
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const lines = input.map((line) => {
    return parseInt(line[0].toString() + line.get(-1).toString());
  });

  return lines.reduce((acc, line) => {
    return acc + line;
  }, 0);
};

const part2 = (rawInput: string) => {
  const pattern = `(${Object.keys(numbers).join("|")}|${Object.values(numbers).join("|")})`;
  const regex = new RegExp(pattern, "g");

  let result = 0;
  
  for (const line of rawInput.trim().split("\n")) {
    const matches = utils.matchOverlapping(line, regex);
    if (matches) {
      const lineNumbers: number[] = matches.map((match) => {
        return parseInt(match in numbers ? numbers[match as keyof typeof numbers] : match);
      });
      const sum = lineNumbers[0] * 10 + lineNumbers.get(-1);
      result += sum;
    }
  }

  return result;
};

run({
  part1: {
    tests: [
      {
        input: `
1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`.trim(),
        expected: 142,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`.trim(),
        expected: 281,
      },
    ],
    solution: part2,
  },
  onlyTests: false,
});