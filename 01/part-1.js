import { consola } from 'consola';
import { getCurrentDay, getRawData } from '../utils.js';
import { submitAnswer } from '../e-c.js';

consola.wrapAll();
const day = getCurrentDay();

consola.start('Starting', day);

const need = {
  A: 0,
  B: 1,
  C: 3,
};

const monsters = getRawData(day).split('');
const potions = monsters.reduce((acc, m) => acc + (need[m] || 0), 0);
consola.info('result', potions);

await submitAnswer({ day, level: 1, answer: potions });

consola.success('Done.');
