import { consola } from 'consola';
import Heap from 'heap';
import {
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
  sum,
} from '../utils.js';

consola.wrapAll();
const day = getCurrentDay();

consola.start('Starting', day);
const begin = new Date().getTime();

const lines = getDataLines(day).map(Number);
const maxdiff = 100;

const stamps = [
  1, 3, 5, 10, 15, 16, 20, 24, 25, 30, 37, 38, 49, 50, 74, 75, 100, 101,
];

// build cache
const cache = new Map();
for (const s of stamps) cache.set(s, 1);
const maxbright = Math.max(...stamps, ...lines.map((l) => l / 2 + maxdiff + 1));
for (let i = 2; i <= maxbright; i++) {
  if (cache.has(i)) continue;
  const possible = stamps
    .map((s) => i - s)
    .filter((v) => v > 0)
    .map((v) => 1 + cache.get(v));
  cache.set(i, Math.min(...possible));
}

let beetles = 0;
for (const bright of lines) {
  const heap = new Heap(([x1, x2], [x3, x4]) => x1 + x2 - x3 - x4);
  const mid = Math.floor(bright / 2);
  for (let i = mid - maxdiff / 2; i <= mid + maxdiff / 2; i++) {
    if (bright - 2 * i > maxdiff) continue;

    const x1 = cache.get(i);
    const x2 = cache.get(bright - i);

    heap.push([x1, x2]);
  }
  console.log(bright, heap.peek());
  beetles += sum(heap.pop());
}

consola.info('result', beetles);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));

consola.success('Done.');
