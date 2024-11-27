import { consola } from 'consola';
import {
  enumGrid,
  formatElapsedTime,
  getCurrentDay,
  getDataLines,
  getGrid,
  manhattan,
  sum,
} from '../utils.js';

consola.wrapAll();
const day = getCurrentDay();

consola.start('Starting', day);
const begin = new Date().getTime();

const grid = getGrid(getDataLines(day));

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
  const constellations = [];
  const key = ([a, b]) => a + ',' + b;

  let nodes = [stars[0]];
  let todo = stars.slice(1);
  let graph = new Map();

  while (todo.length > 0) {
    let best = Infinity;
    let from = [0, 0];
    let to = [0, 0];
    for (const star of nodes) {
      const { dest, dist } = findMin(star, todo);
      if (dist < 6 && dist < best) {
        best = dist;
        from = star;
        to = dest;
      }
    }
    if (best === Infinity) {
      // no more stars to visit on this constellation,
      // start a new one
      constellations.push({
        stars: nodes.length,
        graph,
        size: nodes.length + sum([...graph.values()]),
      });

      graph = new Map();
      nodes = [todo[0]];
      todo = todo.slice(1);
    } else {
      todo = todo.filter((n) => key(n) != key(to));
      nodes.push(to);
      graph.set(`"${key(from)}" -- "${key(to)}"`, best);
    }
  }

  if (graph.size > 0)
    constellations.push({
      stars: nodes.length,
      graph,
      size: nodes.length + sum([...graph.values()]),
    });

  return constellations;
};

const constellations = findBestGraph();
constellations.sort((a, b) => b.size - a.size);

const result = constellations
  .slice(0, 3)
  .map((c) => c.size)
  .reduce((r, size) => r * size, 1);

consola.info('result', result);
consola.success('Done in', formatElapsedTime(begin - new Date().getTime()));
