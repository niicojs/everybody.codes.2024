import 'dotenv/config';
import { consola } from 'consola';
import { getCurrentDay, getDataLines } from '../utils.js';

consola.wrapAll();
const day = getCurrentDay();

consola.start('Starting', day);

const nails = getDataLines(day)
  .map((n) => +n)
  .sort((a, b) => a - b);

const mediane = Math.floor(
  nails.length % 2 === 0
    ? nails[nails.length / 2]
    : (nails[Math.floor(nails.length / 2)] +
        nails[Math.floor(nails.length / 2) + 1]) /
        2
);

console.log({ mediane });

const coup = (target) =>
  nails.map((n) => Math.abs(n - target)).reduce((acc, n) => acc + n, 0);

const result = Math.min(coup(mediane), coup(mediane - 1), coup(mediane + 1));

consola.info('result', result);

consola.success('Done.');
