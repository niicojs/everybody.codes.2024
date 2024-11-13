import path from 'path';
import { readFileSync } from 'fs';
import { consola } from 'consola';
import {
  directNeighbors,
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
  inGridRange,
  stringPermutations,
} from '../utils.js';
import { console } from 'inspector';

consola.wrapAll();
const day = getCurrentDay();

function buildTrack() {
  const rawtrack = readFileSync(
    path.join(import.meta.dirname, 'track.txt'),
    'utf8'
  )
    .split(/\r?\n/)
    .map((l) => l.split(''));

  let track = rawtrack[0][1];
  let previous = [0, 0];
  let [x, y] = [0, 1];
  while (rawtrack[y][x] !== 'S') {
    const next = directNeighbors
      .map(([a, b]) => [x + a, y + b])
      .filter(
        ([a, b]) =>
          inGridRange(rawtrack, a, b) &&
          (a !== previous[0] || b !== previous[1]) &&
          rawtrack[b][a] !== ' '
      );

    previous = [x, y];
    [x, y] = next.at(0);
    track += rawtrack[y][x];
  }
  return track;
}
const track = buildTrack();

consola.log(track);

consola.start('Starting', day);
const begin = new Date().getTime();

// adversaire
const lines = getDataLines(day);
const raw = lines.map((l) => l.split(':')).map(([a, b]) => [a, b.split(',')]);
const chars = new Map();
const paths = new Map();
const total = new Map();
for (const [c, p] of raw) {
  chars.set(c, 10);
  total.set(c, 0);
  paths.set(c, p);
}

function buildPossibilities() {
  const letters = '+-=+-=+-=++';
  let build = [['+'], ['='], ['-']];
  for (let i = 1; i < letters.length; i++) {
    build = build.flatMap((b) => {
      const add = [];
      if (b.filter((c) => c === '+').length < 5) {
        add.push([...b, '+']);
      }
      if (b.filter((c) => c === '=').length < 3) {
        add.push([...b, '=']);
      }
      if (b.filter((c) => c === '-').length < 3) {
        add.push([...b, '-']);
      }
      return add;
    });
  }
  return build;
}
const strats = buildPossibilities();
for (let i = 0; i < strats.length; i++) {
  chars.set('P' + i, 10);
  total.set('P' + i, 0);
  paths.set('P' + i, strats[i]);
}

consola.log('to check', chars.size);

let i = 0;
for (let x = 0; x < 2024; x++) {
  for (let j = 0; j < track.length; j++) {
    const mod = track.at(j);
    for (const c of chars.keys()) {
      const path = paths.get(c);
      let action = path[i % path.length];

      if (mod === '+') action = '+';
      if (mod === '-') action = '-';
      if (action === '+') chars.set(c, chars.get(c) + 1);
      if (action === '-') chars.set(c, Math.max(0, chars.get(c) - 1));

      total.set(c, total.get(c) + chars.get(c));
    }
    i++;
  }
}

const vs = total.get('A');
consola.log('to beat', vs);

const better = Array.from(total.values()).filter((v) => v > vs).length;

consola.info('result', better);
consola.success('Elapsed:', formatElapsedTime(begin - new Date().getTime()));

consola.success('Done.');
