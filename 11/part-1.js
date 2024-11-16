import { consola } from 'consola';
import { formatElapsedTime, getCurrentDay, getDataLines } from '../utils.js';
import { submitAnswer } from '../e-c.js';

consola.wrapAll();
const day = getCurrentDay();

consola.start('Starting', day);
const begin = new Date().getTime();

const lines = getDataLines(day);

consola.info('result', '');
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));

consola.info('check', {
  // ok: result === 0,
  already: [].includes(result),
  // length: result.toString().length === 6,
  // first: result.toString()[0] === '2',
});

// await submitAnswer({ day, level: 1, answer: '' });

consola.success('Done.');
