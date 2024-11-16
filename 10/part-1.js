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

const grid = getGrid(getDataLines(day));
printGrid(grid);

let result = '';
for (let y = 2; y < 6; y++) {
  const line = [...grid[y].slice(0, 2), ...grid[y].slice(3)];
  for (let x = 2; x < 6; x++) {
    const col = [grid[0][x], grid[1][x], grid[6][x], grid[7][x]];
    result += intersection(line, col).at(0);
  }
}

consola.info('result', result);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));

consola.success('Done.');
