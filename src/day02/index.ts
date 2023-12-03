import run from "../deps.ts";
import * as utils from "../utils.ts";

enum Color { red, green, blue };

type Game = {
  id: number,
  sets: Set[],
};

type Set = {
  draws: Draw[],
};

type Draw = {
  number: number,
  color: Color,
}

const parseInput = (rawInput: string) => {
  return rawInput.trim().split("\n").map((line) => {
    const [rawGame, rawSets] = line.split(": ");
    const id = parseInt(rawGame.split(" ")[1]);
    const sets = rawSets.split("; ").map((rawDraw) => {
      const rawDraws = rawDraw.split(", ");
      const draws = [] as Draw[];

      for (const rawDraw of rawDraws) {
        const [rawNumber, rawColor] = rawDraw.replaceAll(",", "").split(" ");
        draws.push({
          number: parseInt(rawNumber),
          color: Color[rawColor as keyof typeof Color],
        });
      }

      return {
        draws,
      } as Set;
    });

    return {
      id,
      sets,
    } as Game;
  });
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const bag = {
    [Color.red]: 12,
    [Color.green]: 13,
    [Color.blue]: 14,
  } as const;

  let sum = 0;
  for (const game of input) {
    let valid = true;
    for (const set of game.sets) {
      for (const draw of set.draws) {
        if (draw.number > bag[draw.color]) {
          valid = false;
          break;
        }
      }
    }
    if (valid) sum += game.id;
  }
  
  return sum;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let result = 0;
  for (const game of input) {
    const minimums = {
      [Color.red]: 0,
      [Color.green]: 0,
      [Color.blue]: 0,
    };
    for (const set of game.sets) {
      for (const draw of set.draws) {
        if (draw.number > minimums[draw.color]) {
          minimums[draw.color] = draw.number;
        }
      }
    }
    const power = minimums[Color.red] * minimums[Color.green] * minimums[Color.blue];
    result += power;
  }
  
  return result;
};

run({
  part1: {
    tests: [
      {
        input: `
Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`.trim(),
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`.trim(),
        expected: 2286,
      },
    ],
    solution: part2,
  },
  onlyTests: false,
});