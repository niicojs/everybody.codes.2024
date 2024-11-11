import 'dotenv/config';
import { consola } from 'consola';
import { getCurrentDay, getDataLines } from '../utils.js';

consola.wrapAll();
const day = getCurrentDay();

consola.start('Starting', day);

const lines = getDataLines(day);
const words = lines[0].slice('WORDS:'.length).split(',');
const allwords = [
  ...words,
  ...words.map((w) => w.split('').reverse().join('')),
];

const print = (grid) => {
  for (const row of grid) {
    console.log(row.join(' '));
  }
};

const grid = lines.slice(1).map((l) => l.split(''));

const mask = new Array(grid.length)
  .fill('.')
  .map(() => new Array(grid[0].length).fill('.'));

const vlines = [];
for (let i = 0; i < grid[0].length; i++) {
  let line = '';
  for (let j = 0; j < grid.length; j++) {
    line += grid[j][i];
  }
  vlines.push(line);
}

let result = 0;

// horizontal
for (let y = 0; y < grid.length; y++) {
  const line = grid[y].join('');
  const fakeline = line + line;
  for (const w of allwords) {
    let i = 0;
    while (i >= 0 && i <= line.length) {
      i = fakeline.indexOf(w, i);
      if (i >= 0) {
        for (let x = i; x < i + w.length; x++) {
          mask[y][x % line.length] = 'x';
        }
        i++;
      }
    }
  }
}

// vertical
for (let x = 0; x < grid[0].length; x++) {
  let line = '';
  for (let i = 0; i < grid.length; i++) {
    line += grid[i][x];
  }
  for (const w of allwords) {
    let i = 0;
    while (i >= 0 && i < line.length) {
      i = line.indexOf(w, i);
      if (i >= 0) {
        for (let y = i; y < Math.min(line.length, i + w.length); y++)
          mask[y][x] = 'x';
        i++;
      }
    }
  }
}

// print(mask);

for (let y = 0; y < mask.length; y++) {
  for (let x = 0; x < mask[0].length; x++) {
    if (mask[y][x] === 'x') result++;
  }
}

consola.info('result', result);

consola.success('Done.');
