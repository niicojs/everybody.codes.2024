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
  let side = 'left';
  clapper = (clapper + 1) % cols.length;
  let left = val % (2 * cols[clapper].length);
  if (left <= cols[clapper].length) {
    // first down
  } else if (left <= 2 * cols[clapper].length) {
    // up on the other side
    side = 'right';
    left -= cols[clapper].length;
    left = cols[clapper].length - left + 1;
  }

  if (side === 'left') {
    if (left === 0) left = 2;
    cols[clapper].splice(left - 1, 0, val);
  } else {
    cols[clapper].splice(left, 0, val);
  }
  // console.log(cols);
  const shout = cols.map((c) => c[0]).join('');
  return shout;
}

let max = '';
const disposition = new Set();
while (true) {
  const shout = round();
  if (shout > max) max = shout;
  const hash = JSON.stringify({ cols, clapper });
  if (disposition.has(hash)) break;
  disposition.add(hash);
}

consola.info('result', max);

consola.success('Done.');
