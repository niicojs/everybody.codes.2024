import { consola } from 'consola';
import { formatElapsedTime, getCurrentDay, getDataLines } from '../utils.js';

consola.wrapAll();
const day = getCurrentDay();

consola.start('Starting', day);
const begin = new Date().getTime();

const lines = getDataLines(day);
const turns = lines.at(0).split(',').map(Number);
const size = turns.length;

const cols = new Array(size).fill(0).map(() => []);
lines.slice(1).forEach((line) => {
  for (let i = 0; i < size; i++) {
    const val = line.slice(4 * i, 4 * i + 3).trim();
    if (val.length > 0) cols[i].push(val);
  }
});

const state = new Array(size).fill(0);

const display = () => {
  let d = '';
  for (let i = 0; i < size; i++) {
    d += cols[i][state[i]] + ' ';
  }
  console.log(d);
};

const wheel = (nb) => {
  for (let i = 0; i < size; i++) {
    state[i] = (state[i] + nb * turns[i]) % cols[i].length;
  }
};

const gain = () => {
  let str = '';
  for (let i = 0; i < size; i++) {
    str += cols[i][state[i]];
  }

  const map = new Map();
  for (let i = 0; i < str.length; i++) {
    map.set(str[i], (map.get(str[i]) || 0) + 1);
  }
  let val = 0;
  for (const [, v] of map) {
    val += Math.max(0, v - 2);
  }
  return val;
};

wheel(100);
display();

consola.success('Done in', formatElapsedTime(begin - new Date().getTime()));
