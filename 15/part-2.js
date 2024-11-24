import { consola } from 'consola';
import Heap from 'heap';
import {
  directNeighbors,
  enumGrid,
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
  getGrid,
  inGridRange,
  inPath,
  memoize,
} from '../utils.js';

consola.wrapAll();
const day = getCurrentDay();

consola.start('Starting', day);
const begin = new Date().getTime();

const lines = getDataLines(day);
const grid = getGrid(lines);

const printGrid = (grid, path = []) => {
  const pad = (grid.length - 1).toString().length;
  console.log(''.padStart(pad, ' ') + ' ┌' + '─'.repeat(grid[0].length) + '┐');
  for (let y = 0; y < grid.length; y++) {
    let line = y.toString().padStart(pad, ' ') + ' │';
    for (let x = 0; x < grid[y].length; x++) {
      if (inPath(path, [x, y])) {
        line += '\x1b[33m' + grid[y][x] + '\x1b[0m';
      } else {
        line += grid[y][x];
      }
    }
    line += '│';
    console.log(line);
  }
  console.log(''.padStart(pad, ' ') + ' └' + '─'.repeat(grid[0].length) + '┘');
};

let start = [0, 0];
let herbstypes = new Map();
for (const { x, y, cell } of enumGrid(grid)) {
  if (y === 0 && cell === '.') start = [x, y];
  else if (cell >= 'A' && cell <= 'Z') {
    const already = herbstypes.get(cell) || [];
    herbstypes.set(cell, [...already, [x, y]]);
  } else if (cell === '~') grid[y][x] = '#';
}

// consola.log({ start, herbs: herbstypes });

const key = ([a, b]) => `${a},${b}`;

const findPath = memoize((from, to) => {
  const heap = new Heap((a, b) => a.path.length - b.path.length);
  heap.push({ path: [from] });
  const done = new Set([key(from)]);

  while (!heap.empty()) {
    const { path } = heap.pop();
    const pos = path.at(-1);

    if (pos[0] === to[0] && pos[1] === to[1]) return path;

    directNeighbors
      .map(([a, b]) => [pos[0] + a, pos[1] + b])
      .filter(
        ([a, b]) =>
          inGridRange(grid, a, b) &&
          grid[b][a] !== '#' &&
          !done.has(key([a, b]))
      )
      .forEach((p) => {
        done.add(key(p));
        heap.push({
          path: [...path, p],
        });
      });
  }

  return null;
});

function findRoute(herbs) {
  const heap = new Heap((a, b) => a.path.length - b.path.length);
  heap.push({ path: [start], picked: [] });

  while (!heap.empty()) {
    const { path, picked } = heap.pop();
    const pos = path.at(-1);

    if (picked.length === herbs.length) {
      const route = findPath(pos, start);
      if (route) {
        return [...path, ...route.slice(1, -1)];
      } else {
        continue;
      }
    }

    const h = herbs[picked.length];
    for (const dest of herbstypes.get(h)) {
      const route = findPath(pos, dest);
      if (route) {
        heap.push({
          path: [...path, ...route.slice(1)],
          picked: [...picked, h],
        });
      }
    }
  }

  return null;
}

// guessed looking at the input
// to test all, stringPermutations('ABCDE').map(s => s.split(''))
const guesses = [
  ['A', 'B', 'C', 'D', 'E'],
  ['A', 'B', 'D', 'E', 'C'],
  ['A', 'B', 'E', 'D', 'C'],
];

let result = Infinity;
let bestroute = [];
for (const guess of guesses) {
  const route = findRoute(guess);
  if (route.length < result) {
    result = route.length;
    bestroute = route;
    console.log(guess.join(','), route.length);
  }
}

printGrid(grid, bestroute);

console.log('result', result);

consola.success('Done in', formatElapsedTime(begin - new Date().getTime()));
