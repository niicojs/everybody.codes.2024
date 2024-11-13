import { consola } from 'consola';
import { formatElapsedTime, getCurrentDay, getDataLines } from '../utils.js';

consola.wrapAll();
const day = getCurrentDay();

consola.start('Starting', day);
const begin = new Date().getTime();

const lines = getDataLines(day);
const raw = lines.map((l) => l.split(':')).map(([a, b]) => [a, b.split(',')]);
const chars = new Map();
const paths = new Map();
const total = new Map();
for (const [c, p] of raw) {
  chars.set(c, 10);
  total.set(c, 0);
  paths.set(c, p);
}

for (let i = 0; i < 10; i++) {
  for (const c of chars.keys()) {
    const action = paths.get(c)[i % paths.get(c).length];
    if (action === '+') chars.set(c, chars.get(c) + 1);
    if (action === '-') chars.set(c, Math.max(0, chars.get(c) - 1));
    total.set(c, total.get(c) + chars.get(c));
  }
}

consola.log(total)

const order = Array.from(total.keys())
  .toSorted((a, b) => total.get(b) - total.get(a))
  .join('');

consola.info('result', order);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));

// auto submit ?

consola.success('Done.');
