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

printGrid(grid);

let start = [0, 0];
let herbs = [];
for (const { x, y, cell } of enumGrid(grid)) {
  if (cell === 'H') herbs.push([x, y]);
  else if (y === 0 && cell === '.') start = [x, y];
}

consola.log({ start, herbs });

const key = ([a, b]) => `${a},${b}`;

function findHerbs() {
  const heap = new Heap((a, b) => a.path.length - b.path.length);
  heap.push({ path: [start] });
  const done = new Set([key(start)]);

  while (!heap.empty()) {
    const { path } = heap.pop();
    const pos = path.at(-1);
    if (grid[pos[1]][pos[0]] === 'H') return path;

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

  return Infinity;
}

const path = findHerbs();
printGrid(grid, path);

consola.info('result', 2 * (path.length - 1));
consola.success('Done in', formatElapsedTime(begin - new Date().getTime()));
