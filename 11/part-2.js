import { consola } from 'consola';
import {
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
  getFromToMap,
} from '../utils.js';

consola.wrapAll();
const day = getCurrentDay();

consola.start('Starting', day);
const begin = new Date().getTime();

const lines = getDataLines(day);
const map = getFromToMap(lines);

let termites = new Map();
termites.set('Z', 1);

function oneday() {
  const newTermites = new Map();
  for (const [k, v] of termites) {
    for (const x of map.get(k)) {
      newTermites.set(x, (newTermites.get(x) || 0) + v);
    }
  }
  return newTermites;
}

for (let i = 0; i < 10; i++) {
  termites = oneday();
}

let result = termites.values().reduce((a, b) => a + b, 0);

consola.info('result', result);
consola.success('Done in', formatElapsedTime(begin - new Date().getTime()));
