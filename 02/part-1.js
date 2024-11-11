import 'dotenv/config';
import { consola } from 'consola';
import { getCurrentDay, getDataLines } from '../utils.js';

consola.wrapAll();
const day = getCurrentDay();

consola.start('Starting', day);

const lines = getDataLines(day);
const words = lines[0].slice('WORDS:'.length).split(',');
const line = lines[1];

const count = (w) => line.match(new RegExp(w, 'g'))?.length || 0;

const res = words.reduce((acc, w) => acc + count(w), 0);

consola.info('result', res);

consola.success('Done.');
