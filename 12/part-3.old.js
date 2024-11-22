import { consola } from 'consola';
import {
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
  inPath,
  sum,
} from '../utils.js';
import { submitAnswer } from '../e-c.js';

consola.wrapAll();
const day = getCurrentDay();

consola.start('Starting', day);
const begin = new Date().getTime();

const meteors = getDataLines(day)
  .map((l) => l.split(' '))
  .map(([a, b]) => [+a + 1, +b + 1]); // relative to A

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

// printGrid(grid);

const segment = [A, B, C];

// calculate possible positions
const targets = [];
for (const [a, b] of meteors) {
  let places = [];
  let [x, y] = [a, b];
  let t = 0;
  while (x > 0 && y > 0 && !inPath(segment, [x, y])) {
    places.push({ t, xy: [x, y] });
    x--;
    y--;
    t++;
  }
  targets.push(places);
}

function canhit(from, to) {
  const nb = to[1];
  let possible = new Array(nb).fill(0).map((_, i) => [to[0] - i, to[1] - i]);
  let bullets = new Array(nb).fill(0).map((_, i) => [from[0], from[1]]);
  for (let i = 1; i <= nb; i++) {
    // position of projectile for each possible force
    for (let p = 1; p < bullets.length; p++) {
      const [a, b] = bullets[p];
      if (i <= p) bullets[p] = [a + 1, b + 1];
      else if (i <= 2 * p) bullets[p] = [a + 1, b];
      else bullets[p] = [a + 1, b - 1];
    }

    // hit ?
    for (let j = 1; j < bullets.length; j++) {
      const [a, b] = bullets[j];
      if (a > 0 && b > 0) {
        for (let k = 0; k < i + 2; k++) {
          if (
            k < possible.length &&
            possible[k][0] === a &&
            possible[k][1] === b
          ) {
            return { time: i, xy: [a, b], rank: from[1] * j };
          }
        }
      }
    }
  }

  return null;
}

const cache = [
  1164, 1073, 1036, 935, 1081, 913, 1578, 1128, 1654, 1692, 1194, 1581, 1202,
  1466, 1499, 927, 874, 1366, 1326, 1463, 1045, 848, 836, 1327, 917, 893, 971,
  1556, 1428, 1156, 1424, 891, 1217, 884, 986, 1199, 1248, 862, 1303, 1443,
  1295, 1274, 971, 937, 955, 983, 927, 1691, 1420, 935, 1367, 973, 663, 1606
];

console.log('cache', cache.length)

let result = sum(cache);
for (let i = cache.length; i < meteors.length; i++) {
  let best = { rank: Infinity };
  for (const from of segment) {
    const hit = canhit(from, meteors[i]);
    if (hit && hit.rank < best.rank) {
      best = hit;
    }
  }
  console.log('   ', i, best);
  result += best.rank;
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
