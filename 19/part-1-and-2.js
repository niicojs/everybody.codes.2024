import { consola } from 'consola';
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

const [key, ...message] = getDataLines(day);
const grid = getGrid(message);

const neighbors = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
];

const rotate = ([x, y], way) => {
  const pos = neighbors.map(([dx, dy]) => [x + dx, y + dy]);
  const val = pos.map(([x, y]) => grid[y][x]);
  const move = way === 'L' ? 1 : -1;
  for (let i = 0; i < pos.length; i++) {
    const idx = (i + pos.length + move) % pos.length;
    const to = pos[idx];
    grid[to[1]][to[0]] = val[i];
  }
};

for (let time = 1; time <= 100; time++) {
  let idx = 0;
  for (let y = 1; y <= grid.length - 2; y++) {
    for (let x = 1; x <= grid[0].length - 2; x++) {
      rotate([x, y], key[idx]);
      idx = (idx + 1) % key.length;
    }
  }
}

printGrid(grid);

let result = grid.map((l) => l.join('')).join('');
result = result.slice(result.indexOf('>') + 1, result.lastIndexOf('<'));

consola.info('result', result);
consola.success('Done in', formatElapsedTime(begin - new Date().getTime()));
