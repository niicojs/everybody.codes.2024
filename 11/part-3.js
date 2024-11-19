import { consola } from 'consola';
import {
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
  getFromToMap,
} from '../utils.js';
import { submitAnswer } from '../e-c.js';

consola.wrapAll();
const day = getCurrentDay();

consola.start('Starting', day);
const begin = new Date().getTime();

const lines = getDataLines(day);
const map = getFromToMap(lines);
const types = Array.from(map.keys());

function test(t, days) {
  let termites = new Map();
  termites.set(t, 1);

  function oneday() {
    const newTermites = new Map();
    for (const [k, v] of termites) {
      for (const x of map.get(k)) {
        newTermites.set(x, (newTermites.get(x) || 0) + v);
      }
    }
    return newTermites;
  }

  for (let i = 0; i < days; i++) {
    termites = oneday();
  }

  return termites.values().reduce((a, b) => a + b, 0);
}

let [min, max] = [Infinity, 0];
for (const t of types) {
  const num = test(t, 20);
  if (num < min) min = num;
  if (num > max) max = num;
}

console.log('result', max - min);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));

consola.success('Done.');
