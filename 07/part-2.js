import { readFileSync } from 'fs';
import { consola } from 'consola';
import { formatElapsedTime, getCurrentDay, getDataLines } from '../utils.js';
import path from 'path';

consola.wrapAll();
const day = getCurrentDay();

const rawtrack = readFileSync(
  path.join(import.meta.dirname, 'track.txt'),
  'utf8'
)
  .split(/\r?\n/)
  .map((l) => l.split(''));

let track = rawtrack[0].slice(1).join('');
for (let i = 1; i < rawtrack.length - 1; i++) track += rawtrack[i].at(-1);
track += rawtrack.at(-1).reverse().join('');
for (let i = rawtrack.length - 2; i >= 1; i--) track += rawtrack[i].at(0);
track += 'S';

consola.log(track);

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

for (let i = 0; i < track.length; i++) {
  const mod = track.at(i);
  for (const c of chars.keys()) {
    let action = paths.get(c)[i % paths.get(c).length];
    
    if (mod === '+') action = '+';
    if (mod === '-') action = '-';
    if (action === '+') chars.set(c, chars.get(c) + 1);
    if (action === '-') chars.set(c, Math.max(0, chars.get(c) - 1));

    total.set(c, total.get(c) + chars.get(c));
  }
}

consola.log(total);

const order = Array.from(total.keys())
  .toSorted((a, b) => total.get(b) - total.get(a))
  .join('');

consola.info('result', order);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));

// auto submit ?

consola.success('Done.');
