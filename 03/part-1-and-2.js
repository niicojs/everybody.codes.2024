import 'dotenv/config';
import { consola } from 'consola';
import {
  directNeighbors,
  getCurrentDay,
  getDataLines,
  getGrid,
} from '../utils.js';

consola.wrapAll();
const day = getCurrentDay();

consola.start('Starting', day);

const grid = getGrid(getDataLines(day));

const print = (grid) => {
  for (const row of grid) {
    console.log(row.join(' '));
  }
  console.log('');
};

const dig = (grid) => {
  let dug = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] > 0) {
        const candig = directNeighbors
          .map(([dy, dx]) => grid[y + dy][x + dx])
          .every((v) => v >= grid[y][x]);
        if (candig) {
          grid[y][x]++;
          dug++;
        }
      }
    }
  }
  return dug;
};

// first dig
let result = 0;
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[0].length; x++) {
    if (grid[y][x] === '.') {
      grid[y][x] = 0;
    } else if (grid[y][x] === '#') {
      grid[y][x] = 1;
      result++;
    }
  }
}

let dug = 0;
while ((dug = dig(grid)) > 0) {
  result += dug;
}

print(grid);

consola.info('result', result);

consola.success('Done.');
