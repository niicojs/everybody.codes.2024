import 'dotenv/config';
import { consola } from 'consola';
import { getCurrentDay, getDataLines } from '../utils.js';

consola.wrapAll();
const day = getCurrentDay();

consola.start('Starting', day);

const lines = getDataLines(day);
const words = lines[0].slice('WORDS:'.length).split(',');
const allwords = [
  ...words,
  ...words.map((w) => w.split('').reverse().join('')),
];

let result = 0;
for (const line of lines.slice(1)) {
  let mask = '.'.repeat(line.length);
  for (const w of allwords) {
    let i = 0;
    while (i >= 0 && i <= line.length - w.length) {
      i = line.indexOf(w, i);
      if (i >= 0) {
        mask =
          mask.slice(0, i) + 'x'.repeat(w.length) + mask.slice(i + w.length);
        i++;
      }
    }
  }
  result += mask.split('').filter((v) => v === 'x').length;
}

consola.info('result', result);

consola.success('Done.');
