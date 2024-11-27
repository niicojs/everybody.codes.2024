import { writeFileSync } from 'fs';
import path from 'path';
import { consola } from 'consola';
import {
  enumGrid,
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
  getGrid,
  manhattan,
  printGrid,
  sum,
} from '../utils.js';

consola.wrapAll();
const day = getCurrentDay();

consola.start('Starting', day);
const begin = new Date().getTime();

const grid = getGrid(getDataLines(day));
printGrid(grid);

const stars = [];
for (const { x, y, cell } of enumGrid(grid)) {
  if (cell === '*') stars.push([x, y]);
}

const findMin = ([a, b], remains) => {
  let min = Infinity;
  let dest = [0, 0];
  for (let i = 0; i < remains.length; i++) {
    const [x, y] = remains[i];
    if (x === a && y === b) continue;
    const dist = manhattan([a, b], [x, y]);
    if (dist < min) {
      min = dist;
      dest = [x, y];
    }
  }

  return { dest, dist: min };
};

const findBestGraph = () => {
  const key = ([a, b]) => a + ',' + b;

  const nodes = [stars[0]];
  let todo = stars.slice(1);
  const graph = new Map();

  while (todo.length > 0) {
    let best = Infinity;
    let from = [0, 0];
    let to = [0, 0];
    for (const star of nodes) {
      const { dest, dist } = findMin(star, todo);
      if (dist < best) {
        best = dist;
        from = star;
        to = dest;
      }
    }
    todo = todo.filter((n) => key(n) != key(to));
    nodes.push(to);
    graph.set(`"${key(from)}" -- "${key(to)}"`, best);
  }

  return graph;
};

const generateGraph = (graph) => {
  let content = '// https://dreampuf.github.io/GraphvizOnline\n';
  content += 'graph G {\n';
  for (const [k, v] of graph) {
    content += `  ${k} [label="${v}"];\n`;
  }
  content += '}\n';
  writeFileSync(path.join(import.meta.dirname, 'graph.dot'), content, 'utf8');
};

const graph = findBestGraph();
generateGraph(graph);

const result = sum([...graph.values()]);
consola.info('result', stars.length + result);
consola.success('Done in', formatElapsedTime(begin - new Date().getTime()));
