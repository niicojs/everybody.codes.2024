import { consola } from 'consola';
import {
  directNeighbors,
  directNeighbors3D,
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
  manhattan,
} from '../utils.js';
import Heap from 'heap';

consola.wrapAll();
const day = getCurrentDay();

consola.start('Starting', day);
const begin = new Date().getTime();

const trees = getDataLines(day).map((l) =>
  l.split(',').map((v) => [v[0], +v.slice(1)])
);

const key = (x, y, z) => `${x},${y},${z}`;
const tree = new Set();
const leaves = [];
const checkleaves = new Set();
let maxtrunk = 0;

for (const values of trees) {
  let [x, y, z] = [0, 0, 0];
  for (const [d, n] of values) {
    if (d === 'U') {
      for (let i = 0; i < n; i++) {
        tree.add(key(x, ++y, z));
      }
      if (x === 0 && z === 0 && y > maxtrunk) maxtrunk = y;
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
        tree.add(key(x, y, ++z));
      }
    } else if (d === 'B') {
      for (let i = 0; i < n; i++) {
        tree.add(key(x, y, --z));
      }
    }
  }
  if (!checkleaves.has(key(x, y, z))) {
    leaves.push([x, y, z]);
    checkleaves.add(key(x, y, z));
  }
}

const miny = Math.min(...leaves.map((l) => l[1]));
const maxleaf = Math.max(...leaves.map((l) => l[1]));
const maxy = Math.min(maxtrunk, maxleaf);

function distance([x1, y1, z1], [x2, y2, z2]) {
  const heap = new Heap((a, b) => a.dist - b.dist);
  heap.push({
    x: x1,
    y: y1,
    z: z1,
    dist: 0,
  });
  const done = new Set([key(x1, y1, z1)]);
  while (!heap.empty()) {
    const { x, y, z, dist } = heap.pop();
    if (x === x2 && y === y2 && z === z2) return dist;

    directNeighbors3D
      .map(([a, b, c]) => [x + a, y + b, z + c])
      .filter(
        ([a, b, c]) =>
          tree.has(key(a, b, c)) &&
          !done.has(key(a, b, c))
      )
      .forEach((n) => {
        done.add(key(n[0], n[1], n[2]));
        heap.push({
          x: n[0],
          y: n[1],
          z: n[2],
          dist: dist + 1,
        });
      });
  }

  return Infinity;
}

let best = Infinity;
for (let j = miny; j <= maxy; j++) {
  if (!tree.has(key(0, j, 0))) continue;

  let dist = 0;
  for (const l of leaves) {
    dist += distance([0, j, 0], l, best);
  }
  if (dist < best) best = dist;
}

consola.info('result', best);
consola.success('Done in', formatElapsedTime(begin - new Date().getTime()));
