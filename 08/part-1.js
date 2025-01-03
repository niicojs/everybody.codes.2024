import { consola } from 'consola';
import { formatElapsedTime, getCurrentDay, getDataLines } from '../utils.js';

consola.wrapAll();
const day = getCurrentDay();

consola.start('Starting', day);
const begin = new Date().getTime();

const existingblocks = +getDataLines(day).at(0);

function numberOfBlock(size) {
  let cnt = 0;
  for (let i = 0; i < size; i++) {
    cnt += i * 2 + 1;
  }
  return cnt;
}

let size = 1;
while (numberOfBlock(size) < existingblocks) size++;

const missing = numberOfBlock(size) - existingblocks;

consola.info('result', missing * (2 * (size - 1) + 1));
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));

// auto submit ?

consola.success('Done.');
