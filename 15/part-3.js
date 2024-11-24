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
} from '../utils.js';

consola.wrapAll();
const day = getCurrentDay();

consola.start('Starting', day);
const begin = new Date().getTime();

const lines = getDataLines(day);
const biggrid = getGrid(lines);

const printGrid = (grid, path = []) => {
  const pad = (grid.length - 1).toString().length;
  console.log(''.padStart(pad, ' ') + ' ┌' + '─'.repeat(grid[0].length) + '┐');
  for (let y = 0; y < grid.length; y++) {
    let line = y.toString().padStart(pad, ' ') + ' │';
    for (let x = 0; x < grid[y].length; x++) {
      const idx = path.findIndex(([i, j]) => i === x && j === y);
      if (idx >= 0 && idx < path.length / 2) {
        line += '\x1b[33m' + grid[y][x] + '\x1b[0m';
      } else if (idx >= 0) {
        line += '\x1b[36m' + grid[y][x] + '\x1b[0m';
      } else {
        line += grid[y][x];
      }
    }
    line += '│';
    console.log(line);
  }
  console.log(''.padStart(pad, ' ') + ' └' + '─'.repeat(grid[0].length) + '┘');
};

const key = ([a, b], herbs, pt) => {
  let k = `${a},${b}`;
  if (herbs) k += ` - ${Array.from(herbs).join(',')}`;
  if (pt) k += ` - ${Array.from(pt).join(',')}`;
  return k;
};

const handleSubGrid = (grid, from, points) => {
  // find all herbs
  const herbs = new Set();
  for (const { cell } of enumGrid(grid)) {
    if (cell >= 'A' && cell <= 'Z') herbs.add(cell);
  }

  const heap = new Heap((a, b) => a.path.length - b.path.length);
  heap.push({ path: [from], picked: new Set(), pt: new Set() });
  const done = new Set([key(from, new Set())]);

  // always to back to start
  const ptset = new Set(points.map((p) => `${p[0]},${p[1]}`));

  while (!heap.empty()) {
    const { path, picked, pt } = heap.pop();
    const pos = path.at(-1);

    let pt2 = pt;
    if (path.length > 2) {
      if (ptset.has(`${pos[0]},${pos[1]}`)) {
        pt2 = new Set(pt.keys());
        pt2.add(`${pos[0]},${pos[1]}`);
      }
    }

    let picked2 = picked;
    const v = grid[pos[1]][pos[0]];
    if (v >= 'A' && v <= 'Z') {
      if (herbs.has(v) && !picked.has(v)) {
        picked2 = new Set(picked.keys());
        picked2.add(v);
      }
    }

    if (picked2.size === herbs.size) {
      if (pt2.size === ptset.size) {
        if (pos[0] === from[0] && pos[1] === from[1]) {
          // printGrid(grid, path);
          return path.length - 1;
        }
      }
    }

    directNeighbors
      .map(([a, b]) => [pos[0] + a, pos[1] + b])
      .filter(
        ([a, b]) =>
          inGridRange(grid, a, b) &&
          grid[b][a] !== '#' &&
          grid[b][a] !== '~' &&
          !done.has(key([a, b], picked2, pt2))
      )
      .forEach((p) => {
        done.add(key(p, picked2, pt2));
        heap.push({
          path: [...path, p],
          picked: picked2,
          pt: pt2,
        });
      });
  }

  return null;
};

const gridL = biggrid.map((l) => l.slice(0, 85));
const gridM = biggrid.map((l) => l.slice(85, 85 * 2));
const gridR = biggrid.map((l) => l.slice(85 * 2));

let start = [0, 0];
for (let i = 0; i < gridM.length; i++) {
  if (gridM[0][i] === '.') start = [i, 0];
}

// middle grid, we have to pick all herbs,
// pass through both doors to other grid and come back to start
const route1 = handleSubGrid(gridM, start, [
  [0, 75],
  [gridM[0].length - 1, 75],
]);

// left grid, we have to pick all herbs, and come back to start
const route2 = handleSubGrid(gridL, [gridM[0].length - 1, 75], []);

// right grid, we have to pick all herbs, and come back to start
const route3 = handleSubGrid(gridR, [0, 75], []);

// result is sum of all path lengths, +4 to cross grids (1 each time)
const result = route1 + route2 + route3 + 4;
console.log('result', result);

consola.success('Done in', formatElapsedTime(begin - new Date().getTime()));
