import { consola } from 'consola';
import { formatElapsedTime, getCurrentDay, getDataLines } from '../utils.js';

consola.wrapAll();
const day = getCurrentDay();

consola.start('Starting', day);
const begin = new Date().getTime();

const trees = getDataLines(day).map((l) =>
  l.split(',').map((v) => [v[0], +v.slice(1)])
);

const key = (x, y, z) => `${x},${y},${z}`;
const tree = new Set();

for (const values of trees) {
  let [x, y, z] = [0, 0, 0];
  for (const [d, n] of values) {
    if (d === 'U') {
      for (let i = 0; i < n; i++) {
        tree.add(key(x, ++y, z));
      }
    } else if (d === 'D') {
      for (let i = 0; i < n; i++) {
        tree.add(key(x, --y, z));
      }
    } else if (d === 'L') {
      for (let i = 0; i < n; i++) {
        tree.add(key(--x, y, z));
      }
    } else if (d === 'R') {
      for (let i = 0; i < n; i++) {
        tree.add(key(++x, y, z));
      }
    } else if (d === 'F') {
      for (let i = 0; i < n; i++) {
        tree.add(key(x, y, --z));
      }
    } else if (d === 'B') {
      for (let i = 0; i < n; i++) {
        tree.add(key(x, y, ++z));
      }
    }
  }
}

consola.info('result', tree.size);
consola.success('Done in', formatElapsedTime(begin - new Date().getTime()));
