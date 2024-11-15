import { consola } from 'consola';
import {
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
  memoize,
} from '../utils.js';

consola.wrapAll();
const day = getCurrentDay();

consola.start('Starting', day);
const begin = new Date().getTime();

const priests = +getDataLines(day).at(0);
const acolytes = 10;
const totalBlocks = 202400000;

const thickness = memoize((layer) => {
  if (layer <= 1) return 1;
  return ((thickness(layer - 1) * priests) % acolytes) + acolytes;
});

const height = memoize((layer) => {
  if (layer <= 1) return 1;
  return height(layer - 1) + thickness(layer);
});

const width = (layer) => layer * 2 - 1;

const getBlocks = memoize((layer) => {
  let blocks = 0;
  const w = width(layer);
  const base = 2 * (layer - 1) + 1;
  for (let i = 1; i <= layer; i++) {
    let h = 0;
    for (let j = layer - i + 1; j <= layer; j++) {
      h += thickness(j);
    }
    if (i === 1) {
      blocks += 2 * h;
    } else {
      const add = h - ((priests * base * h) % acolytes);
      blocks += add;
      if (i !== Math.ceil(w / 2)) {
        blocks += add;
      }
    }
  }
  return blocks;
});

let size = 3670; // first, check 100 by 100 to get an approximate
while (getBlocks(size) < totalBlocks) size++;

const missing = getBlocks(size) - totalBlocks;

consola.info('size', size);
consola.info('needed', getBlocks(size));
consola.info('missing', missing);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));

consola.success('Done.');
