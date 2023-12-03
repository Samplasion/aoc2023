import run from "../deps.ts";
import * as utils from "../utils.ts";

const parseInput = (rawInput: string) => {
  return rawInput.trim().split("\n").map((line) => {
    return line.split("");
  });
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const candidates = [] as number[];

  for (let y = 0; y < input.length; y++) {
    const line = input[y];
    let startingPos = -1;
    let endingPos = -1;
    for (let x = 0; x < line.length; x++) {
      const char = line[x];
      if (/\d/.test(char)) {
        startingPos = x;

        do {
          x++;
          if (x >= line.length) {
            break;
          }
        } while (/\d/.test(line[x]));

        endingPos = x - 1;

        if (startingPos >= 0 && endingPos >= 0) {
          const perimeter = utils.getPerimeter(input, startingPos, y, endingPos - startingPos + 1, 1);
          if (perimeter.some((char) => !/[\d.]/.test(char))) {
            candidates.push(parseInt(line.slice(startingPos, endingPos + 1).join("")));
          }
        }
      }
    }
  }

  return candidates.reduce((acc, candidate) => acc + candidate, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const cogs: utils.Point[] = [];

  for (let y = 0; y < input.length; y++) {
    const line = input[y];
    for (let x = 0; x < line.length; x++) {
      const char = line[x];
      if (char === "*") {
        let cogAdjacentNumbers = 0;

        // Check perimeter
        const { top, sides, bottom } = utils.getPerimeterComplex(input, x, y, 1, 1);

        const topNumbers = top
          .map((char, index) => [char, index] as [string, number])
          .filter(([char]) => /\d/.test(char));
        for (let i = 0; i < topNumbers.length; i++) {
          if (i == topNumbers.length - 1 || topNumbers[i + 1][1] - topNumbers[i][1] > 1) {
            cogAdjacentNumbers++;
          }
        }

        const bottomNumbers = bottom
          .map((char, index) => [char, index] as [string, number])
          .filter(([char]) => /\d/.test(char));
        for (let i = 0; i < bottomNumbers.length; i++) {
          if (i == bottomNumbers.length - 1 || bottomNumbers[i + 1][1] - bottomNumbers[i][1] > 1) {
            cogAdjacentNumbers++;
          }
        }
        
        for (let i = 0; i < sides.length; i++) {
          if (/[\d]/.test(sides[i][0])) {
            cogAdjacentNumbers++;
          }
          if (/[\d]/.test(sides[i][1])) {
            cogAdjacentNumbers++;
          }
        }

        if (cogAdjacentNumbers == 2) {
          cogs.push([x, y]);
        }
      }
    }
  }

  const candidates = new Map<string, number[]>();

  for (let y = 0; y < input.length; y++) {
    const line = input[y];
    let startingPos = -1;
    let endingPos = -1;
    for (let x = 0; x < line.length; x++) {
      const char = line[x];
      if (/\d/.test(char)) {
        startingPos = x;

        do {
          x++;
          if (x >= line.length) {
            break;
          }
        } while (/\d/.test(line[x]));

        endingPos = x - 1;

        const number = parseInt(line.slice(startingPos, endingPos + 1).join(""));

        if (startingPos >= 0 && endingPos >= 0) {
          const rect = [] as utils.Point[];
          for (let x = startingPos; x <= endingPos; x++) {
            rect.push([x, y]);
          }
          const ourCog = cogs.find((cog) => utils.distanceRectPoint(rect, cog) < 2);
          if (ourCog) {
            const key = ourCog.join(",");
            if (!candidates.has(key)) {
              candidates.set(key, []);
            }
            candidates.get(key)?.push(number);
          }
        }
      }
    }
  }

  return [...candidates.values()].reduce((acc, candidate) => acc + candidate.reduce((acc, candidate) => acc * candidate, 1), 0);
};

const testCase = `
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;

run({
  part1: {
    tests: [
      {
        input: testCase,
        expected: 4361,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testCase,
        expected: 467835,
      },
    ],
    solution: part2,
  },
  onlyTests: false,
});