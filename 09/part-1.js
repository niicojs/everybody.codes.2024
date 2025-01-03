import { consola } from 'consola';
import { formatElapsedTime, getCurrentDay, getDataLines } from '../utils.js';

consola.wrapAll();
const day = getCurrentDay();

consola.start('Starting', day);
const begin = new Date().getTime();

const lines = getDataLines(day).map(Number);

const stamps = [1, 3, 5, 10];

let beetles = 0;
for (const bright of lines) {
  let remains = bright;
  for (let i = stamps.length - 1; i >= 0; i--) {
    while (remains >= stamps[i]) {
      remains -= stamps[i];
      beetles++;
    }
  }
}

consola.info('result', beetles);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));

consola.success('Done.');
