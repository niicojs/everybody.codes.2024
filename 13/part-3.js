import { consola } from 'consola';
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
import Heap from 'heap';

consola.wrapAll();
const day = getCurrentDay();

consola.start('Starting', day);
const begin = new Date().getTime();

const lines = getDataLines(day);
const grid = getGrid(lines);
let start = [0, 0];
for (const { x, y, cell } of enumGrid(grid)) {
  if (cell === 'S') {
    grid[y][x] = 0;
  } else if (cell === 'E') {
    start = [x, y];
    grid[y][x] = 0;
  } else if (cell !== '#' && cell !== ' ') {
    grid[y][x] = +grid[y][x];
  }
}

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

consola.log({ start });

const key = (a, b) => a.toString() + ':' + b.toString();

function find(start) {
  const done = new Map();
  const heap = new Heap((a, b) => a.time - b.time);
  heap.push({ path: [start], time: 0 });

  while (!heap.empty()) {
    const { path, time } = heap.pop();
    const [x, y] = path.at(-1);

    const border =
      x === 0 || y === 0 || x === grid[0].length - 1 || y === grid.length - 1;

    if (border) {
      printGrid(grid, path);
      consola.log('found a way', time);
      return time;
    }

    const already = done.get(key(x, y)) || Infinity;
    if (already < time) continue;
    done.set(key(x, y), time);

    // printGrid(grid, path);

    const possible = directNeighbors
      .map(([a, b]) => [x + a, y + b])
      .filter(
        ([a, b]) =>
          inGridRange(grid, a, b) && grid[b][a] !== '#' && !inPath(path, [a, b])
      );

    for (const [a, b] of possible) {
      const ways = [
        Math.abs(grid[b][a] - grid[y][x]), // direct
        Math.abs(10 - grid[y][x]) + grid[b][a], // through top portal
        Math.abs(10 - grid[b][a]) + grid[y][x], // through bottom portal
      ];

      const diff = 1 + Math.min(...ways);
      heap.push({
        path: [...path, [a, b]],
        time: time + diff,
      });
    }
  }

  return Infinity;
}

const result = find(start);

consola.info('result', result);
consola.success('Done in', formatElapsedTime(begin - new Date().getTime()));
