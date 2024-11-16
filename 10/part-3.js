import { consola } from 'consola';
import { intersection, range } from 'remeda';
import {
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
  getGrid,
} from '../utils.js';

consola.wrapAll();
const day = getCurrentDay();

consola.start('Starting', day);
const begin = new Date().getTime();

const allgrids = getGrid(getDataLines(day));
const size = 8;

const grids = [];

let gridid = 1;
const grid = function (x, y) {
  const id = gridid++;
  return {
    id: () => id,
    get: (i, j) => allgrids[y + j][x + i],
    set: (i, j, val) => {
      allgrids[y + j][x + i] = val;
    },
    print: () => {
      console.log('  ┌' + '─'.repeat(8) + '┐');
      for (let j = 0; j < 8; j++) {
        let line = j.toString() + ' │';
        for (let i = 0; i < 8; i++) {
          line += allgrids[y + j][x + i];
        }
        line += '│';
        console.log(line);
      }
      console.log('  └' + '─'.repeat(8) + '┘');
    },
  };
};

let [x, y] = [0, 0];
while (y < allgrids.length) {
  x = 0;
  while (x < allgrids[y].length) {
    grids.push(grid(x, y));
    x += size - 2;
    if (x >= allgrids[y].length - 3) break;
  }
  y += size - 2;
  if (y >= allgrids.length - 3) break;
}

const stringPower = (str) => {
  const map = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let res = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '.') return 0;
    res += (i + 1) * map.indexOf(str[i]);
  }
  return res;
};

const firstPass = (grid) => {
  let done = 0;
  for (let y = 2; y < 6; y++) {
    const line = [
      grid.get(0, y),
      grid.get(1, y),
      grid.get(6, y),
      grid.get(7, y),
    ];
    for (let x = 2; x < 6; x++) {
      const col = [
        grid.get(x, 0),
        grid.get(x, 1),
        grid.get(x, 6),
        grid.get(x, 7),
      ];
      if (grid.get(x, y) !== '.') continue;
      const possible = intersection(line, col);
      if (possible.length === 1) {
        grid.set(x, y, possible[0]);
        done++;
      }
    }
  }
  return done;
};

const secondPass = (grid) => {
  let done = firstPass(grid);
  for (let y = 2; y < 6; y++) {
    for (let x = 2; x < 6; x++) {
      if (grid.get(x, y) !== '.') continue;

      const line = range(0, 8).map((i) => grid.get(i, y));
      const col = range(0, 8).map((j) => grid.get(x, j));
      if (line.includes('?') || col.includes('?')) {
        const all = [...line, ...col];
        const sol = all.filter(
          (c) => c !== '.' && c !== '?' && all.indexOf(c) === all.lastIndexOf(c)
        );
        if (sol.length === 1) {
          grid.set(x, y, sol[0]);
          // update grid
          for (let i = 0; i < 8; i++) {
            if (grid.get(i, y) === '?') grid.set(i, y, sol[0]);
          }
          for (let j = 0; j < 8; j++) {
            if (grid.get(x, j) === '?') grid.set(x, j, sol[0]);
          }
          done++;
        }
      } else {
        // not solvable
        throw new Error('not solvable');
      }
    }
  }

  return done;
};

const gridPower = function (grid) {
  let result = '';
  for (let y = 2; y < 6; y++) {
    for (let x = 2; x < 6; x++) {
      result += grid.get(x, y);
    }
  }

  grid.print();

  return stringPower(result);
};

let result = 0;

// first pass for simple solution
for (const grid of grids) {
  firstPass(grid);
}

// second pass handling question marks
let done = 1;
while (done > 0) {
  done = 0;
  for (const grid of grids) {
    try {
      while (secondPass(grid) > 0) {
        done++;
        firstPass(grid);
      }
    } catch (e) {}
    done += firstPass(grid);
  }
}

for (const grid of grids) {
  result += gridPower(grid) || 0;
}

consola.info('result', result);
consola.info('check', {
  ok: result === 216993,
  already: [201524, 206121].includes(result),
  length: result.toString().length === 6,
  first: result.toString()[0] === '2',
});
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));

consola.success('Done.');
