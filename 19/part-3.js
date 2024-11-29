import { consola } from 'consola';
import {
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
  getGrid,
  printGrid,
} from '../utils.js';

consola.wrapAll();
const day = getCurrentDay();

consola.start('Starting', day);
const begin = new Date().getTime();

const [key, ...message] = getDataLines(day);
const grid = getGrid(message);

const neighbors = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
];

const hash = ([x, y]) => `${x},${y}`;

const rotate = (g, [x, y], way) => {
  const pos = neighbors.map(([dx, dy]) => [x + dx, y + dy]);
  const val = pos.map(([x, y]) => g[y][x]);
  const move = way === 'L' ? 1 : -1;
  for (let i = 0; i < pos.length; i++) {
    const idx = (i + pos.length + move) % pos.length;
    const to = pos[idx];
    g[to[1]][to[0]] = val[i];
  }
};

const findcycle = () => {
  const check = [[], []];
  const fakegrid = new Array(grid.length);
  for (let y = 0; y < grid.length; y++) {
    const line = new Array(grid[0].length);
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === '>') check[0] = [x, y];
      if (grid[y][x] === '<') check[1] = [x, y];
      line[x] = [x, y];
    }
    fakegrid[y] = line;
  }

  // rotate one
  let idx = 0;
  for (let y = 1; y <= fakegrid.length - 2; y++) {
    for (let x = 1; x <= fakegrid[0].length - 2; x++) {
      rotate(fakegrid, [x, y], key[idx]);
      idx = (idx + 1) % key.length;
    }
  }

  // build map
  const map = new Map();
  for (let y = 0; y < fakegrid.length; y++) {
    for (let x = 0; x < fakegrid[0].length; x++) {
      const [xx, yy] = fakegrid[y][x];
      map.set(hash([xx, yy]), [x, y]);
    }
  }

  // try find a cycle
  const findcycle = (coord) => {
    let i = 0;
    let pos = hash(coord);
    let start = pos;
    do {
      pos = hash(map.get(pos));
      i++;
    } while (pos !== start);
    return i;
  };

  const fullcycle = findcycle(check[0]) + findcycle(check[1]);

  console.log('found cycle', fullcycle);

  return { cycle: fullcycle, cache: map };
};

const times = 1048576000;
const { cycle, cache } = findcycle();
let step = grid;
for (let time = 1; time <= times % cycle; time++) {
  const next = new Array(grid.length)
    .fill(0)
    .map(() => new Array(grid[0].length).fill(0));
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      const [xx, yy] = cache.get(hash([x, y]));
      next[yy][xx] = step[y][x];
    }
  }
  step = next;
}

printGrid(step);

let result = step.map((l) => l.join('')).join('');
result = result.slice(result.indexOf('>') + 1, result.lastIndexOf('<'));

consola.info('result', result);
consola.success('Done in', formatElapsedTime(begin - new Date().getTime()));
