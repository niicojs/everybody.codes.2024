import { consola } from 'consola';
import { formatElapsedTime, getCurrentDay, getDataLines } from '../utils.js';

consola.wrapAll();
const day = getCurrentDay();

consola.start('Starting', day);
const begin = new Date().getTime();

const lines = getDataLines(day);

consola.info('result', '');
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));

// auto submit ?

consola.success('Done.');
