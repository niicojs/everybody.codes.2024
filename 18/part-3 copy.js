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
  sum,
} from '../utils.js';

consola.wrapAll();
const day = getCurrentDay();

consola.start('Starting', day);
const begin = new Date().getTime();

const key = ([x, y]) => `${x},${y}`;

export const printFarm = (grid, water) => {
  const pad = (grid.length - 1).toString().length;
  console.log(''.padStart(pad, ' ') + ' ┌' + '─'.repeat(grid[0].length) + '┐');
  for (let y = 0; y < grid.length; y++) {
    let line = y.toString().padStart(pad, ' ') + ' │';
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === 'P') line += '\x1b[32m' + grid[y][x] + '\x1b[0m';
      else if (water.has(key([x, y]))) line += '\x1b[34m~\x1b[0m';
      else line += '\x1b[37m' + grid[y][x] + '\x1b[0m';
    }
    line += '│';
    console.log(line);
  }
  console.log(''.padStart(pad, ' ') + ' └' + '─'.repeat(grid[0].length) + '┘');
};

const farm = getGrid(getDataLines(day));

const treeset = new Set();
const trees = [];
for (const { x, y, cell } of enumGrid(farm)) {
  if (cell === 'P') {
    trees.push([x, y]);
    treeset.add(key([x, y]));
  }
}

const distmap = new Map();

function waterFromTree(idx) {
  let water = [trees[idx]];
  const waterdone = new Set();
  let t = 0;
  while (water.length > 0) {
    t++;
    let next = [];
    for (const [x, y] of water) {
      const possible = directNeighbors
        .map(([dx, dy]) => [x + dx, y + dy])
        .filter(
          ([x, y]) =>
            inGridRange(farm, x, y) &&
            farm[y][x] !== '#' &&
            !waterdone.has(key([x, y]))
        );
      for (const [x, y] of possible) {
        const k = key([x, y]);
        if (!waterdone.has(k)) {
          if (!distmap.has(k)) {
            distmap.set(k, new Array(trees.length).fill(Infinity));
          }
          distmap.get(k)[idx] = t;
          waterdone.add(k);
          next.push([x, y]);
        }
      }
    }
    water = next;
  }
  // printFarm(farm, waterdone);
}

function waterall(start, max) {
  let water = [start];
  const waterdone = new Set();
  waterdone.add(key(start));
  const treedone = new Set();
  let t = 0;
  let result = 0;
  while (water.length > 0 && t <= max) {
    t++;
    let next = [];
    for (const [x, y] of water) {
      const possible = directNeighbors
        .map(([dx, dy]) => [x + dx, y + dy])
        .filter(
          ([x, y]) =>
            inGridRange(farm, x, y) &&
            farm[y][x] !== '#' &&
            !waterdone.has(key([x, y]))
        );
      for (const [x, y] of possible) {
        if (trees.has(key([x, y]))) {
          if (!treedone.has(key([x, y]))) {
            result += t;
            treedone.add(key([x, y]));
            if (treedone.size === trees.size) return result;
          }
        }
        waterdone.add(key([x, y]));
        next.push([x, y]);
      }
    }
    water = next;
  }
}

for (let i = 0; i < trees.length; i++) {
  waterFromTree(i);
}

let min = Infinity;
for (const [k, v] of distmap) {
  // if (treeset.has(k)) continue;

  const s = sum(v);
  if (s < min) {
    min = s;
    console.log(k, s);
  }
}

console.log('result', 237421, min, min === 237421);

consola.success('Done in', formatElapsedTime(begin - new Date().getTime()));
