import 'dotenv/config';
import { consola } from 'consola';
import { getCurrentDay, getDataLines } from '../utils.js';

consola.wrapAll();
const day = getCurrentDay();

consola.start('Starting', day);

const lines = getDataLines(day);
const grid = lines.map((l) => l.split(' ').map(Number));

const cols = new Array(grid[0].length).fill(0);
for (let i = 0; i < cols.length; i++) {
  cols[i] = [];
  for (let j = 0; j < grid.length; j++) {
    cols[i].push(grid[j][i]);
  }
}

// console.log(cols);

let clapper = 0;
function round() {
  const val = cols[clapper].shift();
  clapper = (clapper + 1) % cols.length;
  cols[clapper].splice(val - 1, 0, val);
  // console.log(cols);
  const shout = cols.map((c) => c[0]).join('');
  // console.log(shout);
  return shout;
}

let result = '';
for (let i = 0; i < 10; i++) {
  result = round();
}

consola.info('result', result);

consola.success('Done.');
