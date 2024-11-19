import { existsSync, readFileSync } from 'fs';
import path from 'path';

/**
 *
 * @returns string
 */
export function getCurrentDay() {
  let file = path.parse(path.dirname(process.argv[1])).name;
  if (!file.match(/^(\d+)/)) {
    file = path.parse(process.argv[1]).name;
  }
  return file.match(/^(\d+)/)[0];
}

/**
 *
 * @param {string} day
 * @returns string
 */
export function getRawData(day) {
  let file = [
    path.join(path.dirname(process.argv[1]), './input.txt'),
    path.join(path.dirname(process.argv[1]), day + '.txt'),
    path.join('./inputs', day + '.txt'),
  ].find((p) => existsSync(p));

  return readFileSync(file, 'utf8');
}

/**
 *
 * @param {string} day
 * @returns string[]
 */
export function getDataLines(day, removeBlank = true) {
  const raw = getRawData(day);
  let lines = raw.split(/\r?\n/);
  if (removeBlank) {
    lines = lines.filter(Boolean);
  }
  return lines;
}

/**
 *
 * @param {string[]} lines
 * @returns string[][]
 */
export function getGrid(lines) {
  return lines.map((l) => l.split(''));
}

/**
 * Converts an array of strings into a map, splitting each string using a delimiter.
 * Each string is expected to contain a pair of values separated by the delimiter.
 * The first value is used as the key and the second value is a comma-separated list
 * which is split into an array and stored as the value.
 *
 * @param {string[]} lines - An array of strings, each containing a pair of values.
 * @param {string} [delim=':'] - The delimiter used to split each string into a pair of values.
 * @returns {Map<string, string[]>} - A map where each key is a string and each value is an array of strings.
 */

export function getFromToMap(lines, delim = ':') {
  const map = new Map();
  for (const line of lines) {
    const [from, to] = line.split(delim);
    map.set(from, to.split(','));
  }
  return map;
}

/**
 *
 * @param {any[][]} grid
 * @param {number} x
 * @param {number} y
 * @returns boolean
 */
export function inGridRange(grid, x, y) {
  return y >= 0 && y < grid.length && x >= 0 && x < grid[y].length;
}

/**
 * @param {any[][]} grid
 */
export const printGrid = (grid) => {
  const pad = (grid.length - 1).toString().length;
  console.log(''.padStart(pad, ' ') + ' ┌' + '─'.repeat(grid[0].length) + '┐');
  for (let y = 0; y < grid.length; y++) {
    let line = y.toString().padStart(pad, ' ') + ' │';
    for (let x = 0; x < grid[y].length; x++) {
      line += grid[y][x];
    }
    line += '│';
    console.log(line);
  }
  console.log(''.padStart(pad, ' ') + ' └' + '─'.repeat(grid[0].length) + '┘');
};

/**
 *
 * @param {number[]} arr
 * @returns number
 */
export function sum(arr) {
  return arr.reduce((acc, v) => acc + v, 0);
}

/**
 *
 * @param {number[]} arr
 * @returns number
 */
export function product(arr) {
  return arr.reduce((acc, v) => acc * v, 1);
}

export function* enumerate(enumerable) {
  let i = 0;
  for (const item of enumerable) yield [i++, item];
}

export function* enumGrid(grid) {
  for (const [y, row] of enumerate(grid)) {
    for (const [x, cell] of enumerate(row)) {
      yield { x, y, row, cell };
    }
  }
}

/** @type {[number, number][]} */
export const directNeighbors = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];
/** @type {[number, number][]} */
export const diagNeighbors = [
  [1, 1],
  [1, -1],
  [-1, -1],
  [-1, 1],
];
export const neighbors = [...diagNeighbors, ...directNeighbors];

export function chunk(arr, len) {
  arr = [...arr];
  return [...Array(Math.ceil(arr.length / len))].map((_, i) =>
    arr.slice(i * len, (i + 1) * len)
  );
}

const gcd = (x, y) => (!y ? x : gcd(y, x % y));
const _lcm = (x, y) => (x * y) / gcd(x, y);
/**
 *
 * @param {number[]} arr
 * @returns number[]
 */
export const lcm = (arr) => {
  return arr.reduce((a, b) => _lcm(a, b));
};

export function deepEqual(a, b) {
  if (typeof a !== 'object') {
    return a === b;
  }
  return (
    Object.keys(a).length === Object.keys(b).length &&
    Object.entries(a).every(([k, v]) => deepEqual(v, b[k]))
  );
}

export function shallowEqual(a, b) {
  if (typeof a !== 'object') {
    return a === b;
  }
  return (
    Object.keys(a).length === Object.keys(b).length &&
    Object.entries(a).every(([k, v]) => v === b[k])
  );
}

export function memoize(func, resolver = (...args) => JSON.stringify(args)) {
  const cache = new Map();
  return function (...args) {
    const key = resolver.apply(this, args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = func.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

export function dist([x1, y1], [x2, y2]) {
  return ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5;
}

export function manhattan([x1, y1], [x2, y2]) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

export const inPath = (path, [x, y]) =>
  path.some(([i, j]) => i === x && j === y);

export const formatElapsedTime = (elapsed) => {
  const diff = Math.abs(elapsed);

  const minutes = Math.floor(diff / 60 / 1000) % 60;
  const seconds = Math.floor((diff / 1000) % 60);
  const milliseconds = Math.floor(diff % 1000);

  let result = '';
  if (minutes > 0) {
    result += `${minutes.toString().padStart(2, 0)}min `;
  }
  if (seconds > 0) {
    result += `${seconds.toString().padStart(2, 0)}s `;
  }

  return result + `${milliseconds.toString().padEnd(3, 0)}ms`;
};

export const lacet = (path) => {
  let res = 0;
  for (let i = 0; i < path.length; i++) {
    const [x1, y1] = path[i];
    const [x2, y2] = path[(i + 1) % path.length];
    res += x1 * y2 - x2 * y1;
  }
  return Math.abs(res) / 2;
};

/**
 * These ranges are inclusive
 *
 * @param {[number, number][]} ranges
 * @returns
 */
export function mergeRanges(ranges) {
  ranges.sort(([min1], [min2]) => min1 - min2);
  const merged = [ranges[0]];
  for (const [min, max] of ranges.slice(1)) {
    const last = merged[merged.length - 1];
    if (min <= last[1] + 1) {
      last[1] = Math.max(max, last[1]);
    } else {
      merged.push([min, max]);
    }
  }
  return merged;
}

/**
 * All permutations of a string
 *
 * @param {string} str
 * @returns string[]
 */
export function stringPermutations(str) {
  if (str.length <= 2) return str.length === 2 ? [str, str[1] + str[0]] : [str];
  return str
    .split('')
    .reduce(
      (acc, letter, i) =>
        acc.concat(
          stringPermutations(str.slice(0, i) + str.slice(i + 1)).map(
            (val) => letter + val
          )
        ),
      []
    );
}
