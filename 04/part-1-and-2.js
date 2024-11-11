import 'dotenv/config';
import { consola } from 'consola';
import { getCurrentDay, getDataLines } from '../utils.js';

consola.wrapAll();
const day = getCurrentDay();

consola.start('Starting', day);

const nails = getDataLines(day).map((n) => +n);
const target = Math.min(...nails);

console.log({ target });

let result = nails.map((n) => n - target).reduce((acc, n) => acc + n, 0);

consola.info('result', result);

consola.success('Done.');
