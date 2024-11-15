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

const acolytes = 1111;
const totalBlocks = 20240000;

const thickness = memoize((layer) => {
  if (layer <= 1) return 1;
  return (thickness(layer - 1) * priests) % acolytes;
});

const numberOfBlock = memoize((layer) => {
  if (layer === 1) return 1;
  const prev = numberOfBlock(layer - 1);
  const thick = thickness(layer);
  return prev + (layer * 2 - 1) * thick;
});

let size = 1;
while (numberOfBlock(size) < totalBlocks) size++;

const missing = numberOfBlock(size) - totalBlocks;

consola.info('result', missing * (2 * (size - 1) + 1));
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));

consola.success('Done.');
