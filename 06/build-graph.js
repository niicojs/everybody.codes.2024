import { writeFileSync } from 'fs';
import path from 'path';
import { consola } from 'consola';
import { getCurrentDay, getDataLines } from '../utils.js';

consola.wrapAll();
const day = getCurrentDay();

consola.start('Starting', day);
const begin = new Date().getTime();

const data = getDataLines(day)
  .map((l) => l.split(':'))
  .map(([from, to]) => [from, to.split(',')]);

let graph = 'digraph G {\n';
for (let [from, tos] of data) {
  tos = tos.map((t) => (t === '@' ? 'END' : t));
  graph += `  ${from} -> {${tos.join(' ')}};\n`;
}
graph += '}';

writeFileSync(path.join(import.meta.dirname, 'graph.dot'), graph, 'utf8');

consola.success('Done.');
