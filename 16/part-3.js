import { consola } from 'consola';
import {
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
  memoize,
} from '../utils.js';

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

const right = (state, nb = 1) => {
  for (let i = 0; i < size; i++) {
    state[i] = (state[i] + nb * turns[i]) % cols[i].length;
  }
  return { state, value: gain(state) };
};

const left = (state, dir) => {
  const newstate = new Array(size).fill(0);
  for (let i = 0; i < size; i++) {
    newstate[i] = (state[i] + dir + cols[i].length) % cols[i].length;
  }
  return newstate;
};

const gain = (state) => {
  let str = '';
  for (let i = 0; i < size; i++) {
    str += cols[i][state[i]][0] + cols[i][state[i]][2];
  }

  const map = new Map();
  for (let i = 0; i < str.length; i++) {
    map.set(str[i], (map.get(str[i]) || 0) + 1);
  }
  let val = 0;
  for (const [, v] of map) val += Math.max(0, v - 2);

  return val;
};

const key = (state) => state.join(',');

const pull = memoize((state) => {
  const one = right(left(state, 1));
  const two = right(left(state, -1));
  const three = right(left(state, 0));

  return [one, two, three];
});

const state = new Array(size).fill(0);

const target = 256;
let states = new Map();
states.set(key(state), { state, min: 0, max: 0 });

for (let i = 0; i < target; i++) {
  // consola.log(i, states.size);
  let next = new Map();
  for (const { state, min, max } of states.values()) {
    const results = pull(state);
    for (const res of results) {
      const k = key(res.state);
      if (next.has(k)) {
        next.get(k).min = Math.min(next.get(k).min, min + res.value);
        next.get(k).max = Math.max(next.get(k).max, max + res.value);
      } else {
        next.set(k, {
          state: res.state,
          min: min + res.value,
          max: max + res.value,
        });
      }
    }
  }
  states = next;
}

const max = states.values().reduce((p, { max }) => (max > p ? max : p), 0);
const min = states
  .values()
  .reduce((p, { min }) => (min < p ? min : p), Infinity);

console.log('result', max, min);

consola.success('Done in', formatElapsedTime(begin - new Date().getTime()));
