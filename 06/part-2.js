import { consola } from 'consola';
import { formatElapsedTime, getCurrentDay, getDataLines } from '../utils.js';
import Heap from 'heap';

consola.wrapAll();
const day = getCurrentDay();

consola.start('Starting', day);
const begin = new Date().getTime();

const data = getDataLines(day)
  .map((l) => l.split(':'))
  .map(([from, to]) => [from, to.split(',')]);

const branches = new Map();
for (const [from, tos] of data) {
  branches.set(from, tos);
}

const heap = new Heap((a, b) => a.length - b.length);
heap.push(['RR']);

const results = new Map();

while (!heap.empty()) {
  const path = heap.pop();
  const last = path.at(-1);
  const next = branches.get(last);
  if (next) {
    for (const n of next) {
      if (n === '@') {
        results.set(path.length, [...(results.get(path.length) || []), path]);
        // consola.info(path.join('') + '@');
      } else {
        heap.push([...path, n]);
      }
    }
  }
}

for (const [k, v] of results) {
  if (v.length === 1) {
    consola.info(v[0].map((s) => s[0]).join('') + '@');
    break;
  }
}

consola.success('Done in', formatElapsedTime(begin - new Date().getTime()));