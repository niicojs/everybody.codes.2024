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

const display = (state) => {
  let d = '';
  for (let i = 0; i < size; i++) {
    d += cols[i][state[i]] + ' ';
  }
  console.log(d);
};

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
const findloop = (state) => {
  const loop = key(state);
  let idx = 0;
  let g = 0;
  do {
    right(state, 1);
    g += gain(state);
    idx++;
  } while (key(state) !== loop);
  return { loop: idx, loopval: g };
};

const state = new Array(size).fill(0);

const target = 100;
let possible = [{ state, value: 0 }];
for (let i = 0; i < target; i++) {
  let next = [];
  for (const p of possible) {
    next.push(right(left(p.state, 1)));
    next.push(right(left(p.state, -1)));
    next.push(right(p.state));
  }
  possible = next;
}

consola.log('possible', possible.length);
const maxc = Math.max(...possible.map((p) => p.value));
const minc = Math.min(...possible.map((p) => p.value));

// const { loop, loopval } = findloop(state);

// const run = target % loop;
// const mult = Math.floor(target / loop);
// let result = 0;
// for (let i = 0; i < run; i++) {
//   right(state, 1);
//   result += gain(state);
// }

// result += mult * loopval;

// consola.info({ loop, loopval, run, mult });
consola.info('result', maxc, minc);
consola.success('Done in', formatElapsedTime(begin - new Date().getTime()));
