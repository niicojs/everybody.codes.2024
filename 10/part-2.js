import { consola } from 'consola';
import { intersection } from 'remeda';
import {
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
  getGrid,
  printGrid,
} from '../utils.js';

consola.wrapAll();
const day = getCurrentDay();

consola.start('Starting', day);
const begin = new Date().getTime();

const allgrids = getGrid(getDataLines(day));
const size = 8;

const grids = [];

let [x, y] = [0, 0];
while (y < allgrids.length) {
  x = 0;
  while (x < allgrids[y].length) {
    const grid = new Array(size);
    for (let i = 0; i < size; i++) {
      grid[i] = allgrids[y + i].slice(x, x + size);
    }
    grids.push(grid);
    x += size + 1;
  }
  y += size; // no +1 cause we remove empty line from input
}

const stringPower = (str) => {
  const map = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let res = 0;
  for (let i = 0; i < str.length; i++) {
    res += (i + 1) * map.indexOf(str[i]);
  }
  return res;
};

const gridPower = function (grid) {
  let result = '';
  for (let y = 2; y < 6; y++) {
    const line = [...grid[y].slice(0, 2), ...grid[y].slice(3)];
    for (let x = 2; x < 6; x++) {
      const col = [grid[0][x], grid[1][x], grid[6][x], grid[7][x]];
      result += intersection(line, col).at(0);
    }
  }

  return stringPower(result);
};

let result = 0;
for (const grid of grids) {
  result += gridPower(grid);
}

consola.info('result', result);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));

consola.success('Done.');
