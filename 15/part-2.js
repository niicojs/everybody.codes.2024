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

const key = ([a, b], herbs) => {
  let k = `${a},${b}`;
  if (herbs) k += ` - ${Array.from(herbs).join(',')}`;
  return k;
};

const solve = (grid, from) => {
  // find all herbs
  const herbs = new Set();
  for (const { cell } of enumGrid(grid)) {
    if (cell >= 'A' && cell <= 'Z') herbs.add(cell);
  }

  // find a path that goes through all herbs and back to start
  const heap = new Heap((a, b) => a.path.length - b.path.length);
  heap.push({ path: [from], picked: new Set() });
  const done = new Set([key(from, new Set())]);

  while (!heap.empty()) {
    const { path, picked } = heap.pop();
    const pos = path.at(-1);

    let newpicked = picked;
    const v = grid[pos[1]][pos[0]];
    if (v >= 'A' && v <= 'Z') {
      if (herbs.has(v) && !picked.has(v)) {
        newpicked = new Set(picked.keys());
        newpicked.add(v);
      }
    }

    if (newpicked.size === herbs.size) {
      if (pos[0] === from[0] && pos[1] === from[1]) {
        return path.length - 1;
      }
    }

    directNeighbors
      .map(([a, b]) => [pos[0] + a, pos[1] + b])
      .filter(
        ([a, b]) =>
          inGridRange(grid, a, b) &&
          grid[b][a] !== '#' &&
          grid[b][a] !== '~' &&
          !done.has(key([a, b], newpicked))
      )
      .forEach((p) => {
        done.add(key(p, newpicked));
        heap.push({
          path: [...path, p],
          picked: newpicked,
        });
      });
  }

  return null;
};

let start = [0, 0];
for (let i = 0; i < grid[0].length; i++) {
  if (grid[0][i] === '.') start = [i, 0];
}

const result = solve(grid, start);
console.log('result', result);

consola.success('Done in', formatElapsedTime(begin - new Date().getTime()));
