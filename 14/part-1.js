import { consola } from 'consola';
import { formatElapsedTime, getCurrentDay, getDataLines } from '../utils.js';

consola.wrapAll();
const day = getCurrentDay();

consola.start('Starting', day);
const begin = new Date().getTime();

const values = getDataLines(day)
  .at(0)
  .split(',')
  .map((v) => [v[0], +v.slice(1)]);

let current = 0;
let max = 0;
for (const [d, n] of values) {
  if (d === 'U') {
    current += n;
    if (current > max) max = current;
  } else if (d === 'D') {
    current -= n;
  }
}

consola.info('result', max);
consola.success('Done in', formatElapsedTime(begin - new Date().getTime()));
