import { consola } from 'consola';
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

export const printFarm = (grid) => {
  const pad = (grid.length - 1).toString().length;
  console.log(''.padStart(pad, ' ') + ' ┌' + '─'.repeat(grid[0].length) + '┐');
  for (let y = 0; y < grid.length; y++) {
    let line = y.toString().padStart(pad, ' ') + ' │';
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === 'P') line += '\x1b[32m' + grid[y][x] + '\x1b[0m';
      else if (grid[y][x] === '~') line += '\x1b[34m' + grid[y][x] + '\x1b[0m';
      else line += '\x1b[37m' + grid[y][x] + '\x1b[0m';
    }
    line += '│';
    console.log(line);
  }
  console.log(''.padStart(pad, ' ') + ' └' + '─'.repeat(grid[0].length) + '┘');
};

const farm = getGrid(getDataLines(day));

let start = [0, 0];
const key = ([x, y]) => `${x},${y}`;
const trees = new Set();
for (const { x, y, cell } of enumGrid(farm)) {
  if (cell === 'P') trees.add(key([x, y]));
  if (x === 0 && cell === '.') {
    farm[y][x] = '~';
    start = [x, y];
  }
}

function waterall() {
  let water = [start];
  const done = new Set();
  let t = 0;
  while (true) {
    t++;
    let next = [];
    for (const [x, y] of water) {
      const possible = directNeighbors
        .map(([dx, dy]) => [x + dx, y + dy])
        .filter(
          ([x, y]) =>
            inGridRange(farm, x, y) &&
            farm[y][x] !== '#' &&
            farm[y][x] !== '~' &&
            !done.has(key([x, y]))
        );
      for (const [x, y] of possible) {
        if (trees.has(key([x, y]))) {
          done.add(key([x, y]));
          if (done.size === trees.size) return t;
        } else farm[y][x] = '~';
        next.push([x, y]);
      }
    }
    water = next;
  }
}

const result = waterall();
printFarm(farm);
console.log('result', result);

consola.success('Done in', formatElapsedTime(begin - new Date().getTime()));
