import "./extensions.ts";

export function matchOverlapping(string: string, regex: RegExp): string[] {
  const res: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(string)) != null) {
    res.push(match[0]);
    regex.lastIndex = match.index + 1; // <- Important
  }
  return res;
}

export function getPerimeterComplex<T>(grid: T[][], x: number, y: number, width: number, height: number): Perimeter<T> {
  const perimeter = {
    top: [],
    sides: [],
    bottom: [],
  } as Perimeter<T>;

  if (y - 1 >= 0)
    perimeter.top.push(...grid[y - 1].slice(Math.max(0, x - 1), Math.min(grid.length, x + width + 1)));
  for (let i = y; i < y + height; i++) {
    perimeter.sides.push([grid[i][x - 1], grid[i][x + width]]);
  }
  if (y + height < grid.length)
    perimeter.bottom.push(...grid[y + height].slice(Math.max(0, x - 1), Math.min(grid.length, x + width + 1)));

  return perimeter;
}

export function getPerimeter<T>(grid: T[][], x: number, y: number, width: number, height: number): T[] {
  const { top, sides, bottom } = getPerimeterComplex(grid, x, y, width, height);
  return [...top, ...sides.flat(), ...bottom];
}

export function zip<T>(grid: T[][]): T[][] {
  const result = [] as T[][];
  for (let i = 0; i < grid[0].length; i++) {
    result.push([]);
    for (let j = 0; j < grid.length; j++) {
      result[i].push(grid[j][i]);
    }
  }
  return result;
}

export function distance(a: Point, b: Point): number {
  return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2))
}

export function distanceRectPoint(rect: Point[], point: Point): number {
  const distances = rect.map((p) => distance(p, point));
  return Math.min(...distances);
}

// Types

export type Point = [x: number, y: number];

export interface Perimeter<T> {
  top: T[];
  sides: T[][];
  bottom: T[];
}