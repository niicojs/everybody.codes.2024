import { consola } from 'consola';
import {
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
} from '../utils.js';
import { submitAnswer } from '../e-c.js';

consola.wrapAll();
const day = getCurrentDay();

consola.start('Starting', day);
const begin = new Date().getTime();

const meteors = getDataLines(day)
  .map((l) => l.split(' '))
  .map(([a, b]) => [+a + 1, +b + 1]); // relative to A

console.log(meteors);

const [maxx, maxy] = [
  Math.max(...meteors.map((m) => m[0])),
  Math.max(...meteors.map((m) => m[1])),
];

const grid = new Array(maxy + 1).fill(0).map((_, i) => {
  if (i === 0) return new Array(maxx + 1).fill('=');
  return new Array(maxx + 1).fill('.');
});

export const printGrid = (grid) => {
  const pad = (grid.length - 1).toString().length;
  console.log(''.padStart(pad, ' ') + ' ┌' + '─'.repeat(grid[0].length) + '┐');
  for (let y = grid.length - 1; y >= 0; y--) {
    let line = y.toString().padStart(pad, ' ') + ' │';
    for (let x = 0; x < grid[y].length; x++) {
      line += grid[y][x];
    }
    line += '│';
    console.log(line);
  }
  console.log(''.padStart(pad, ' ') + ' └' + '─'.repeat(grid[0].length) + '┘');
};

const A = [1, 1];
const B = [1, 2];
const C = [1, 3];
grid[1][1] = 'A';
grid[2][1] = 'B';
grid[3][1] = 'C';

for (const [a, b] of meteors) {
  grid[b][a] = '#';
}

printGrid(grid);

const segment = [C, B, A];

const targets = [];
for (let y = grid.length - 1; y >= 0; y--) {
  for (let x = 0; x < grid[y].length; x++) {
    if (grid[y][x] === 'T') targets.push([x, y]);
    else if (grid[y][x] === 'H') targets.push([x, y], [x, y]);
  }
}

consola.log({ target: targets });

const fire = (from, to) => {
  const [a, b] = from;
  const [x, y] = to;

  const w = x - a;
  const h = b - y;

  const power = (w - h) / 3;

  if (Math.round(power) !== power) return 0;
  return power;
};

let result = 0;
for (let i = 0; i < targets.length; i++) {
  const [x, y] = targets[i];

  let from = [0, 0];
  let s = 0;
  let power = 0;
  do {
    from = segment.at(s);
    power = fire(from, [x, y]);
    if (power > 0) segment.push(segment.shift());
    else s = (s + 1) % segment.length;
  } while (power === 0);

  consola.log('target', from, { x, y }, { power }, from[1]);
  result += from[1] * power;
}

consola.info('result', result);
consola.success('Done in', formatElapsedTime(begin - new Date().getTime()));

// consola.info('check', {
// ok: result === 0,
// already: [].includes(result),
// length: result.toString().length === 6,
// first: result.toString()[0] === '2',
// });

// await submitAnswer({ day, level: 1, answer: '' });
