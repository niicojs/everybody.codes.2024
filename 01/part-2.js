import { consola } from 'consola';
import { chunk, getCurrentDay, getRawData } from '../utils.js';
import { submitAnswer } from '../e-c.js';

consola.wrapAll();
const day = getCurrentDay();

consola.start('Starting', day);

const need = {
  A: 0,
  B: 1,
  C: 3,
  D: 5,
};

const monsters = getRawData(day).split('');
let potions = 0;
for (const [m1, m2] of chunk(monsters, 2)) {
  potions += (need[m1] || 0) + (need[m2] || 0);
  if (m1 !== 'x' && m2 !== 'x') potions += 2;
}

consola.info('result', potions);

await submitAnswer({ day, level: 2, answer: potions });

consola.success('Done.');
