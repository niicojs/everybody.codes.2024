import { consola } from 'consola';
import { formatElapsedTime, getCurrentDay, getDataLines } from '../utils.js';

consola.wrapAll();
const day = getCurrentDay();

consola.start('Starting', day);
const begin = new Date().getTime();

const lines = getDataLines(day).map(Number);

const stamps = [1, 3, 5, 10, 15, 16, 20, 24, 25, 30];
const cache = new Map();
for (const s of stamps) cache.set(s, 1);
// build cache
for (let i = 2; i <= Math.max(...stamps, ...lines); i++) {
  if (cache.has(i)) continue;
  const possible = stamps
    .map((s) => i - s)
    .filter((v) => v > 0)
    .map((v) => 1 + cache.get(v));
  cache.set(i, Math.min(...possible));
}

let beetles = 0;
for (const bright of lines) {
  const x = cache.get(bright);
  beetles += x;
}

consola.info('result', beetles);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));

consola.success('Done.');
