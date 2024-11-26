import { existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import consola from 'consola';
import {
  chunk,
  enumGrid,
  getCurrentDay,
  getDataLines,
  getGrid,
} from '../utils.js';

consola.wrapAll();

consola.start('Starting...');

function getDevPackFolder() {
  const localAppData = process.env.LOCALAPPDATA;
  const devPacks = path.join(
    localAppData,
    `/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/development_behavior_packs`
  );

  const root = path.join(devPacks, 'everybody_codes');
  if (!existsSync(root)) mkdirSync(root);

  const manifest = path.join(root, 'manifest.json');
  if (!existsSync(manifest)) {
    const data = {
      format_version: 2,
      header: {
        description: 'visualize everybody.codes data',
        name: 'everybody codes',
        uuid: '4b0c038f-87e0-431d-bc8b-c81b73874683',
        version: [1, 0, 0],
        min_engine_version: [1, 19, 73],
      },
      modules: [
        {
          description: '§r',
          type: 'data',
          uuid: '73c54fdf-4eda-49e7-b29e-7e0deae325ad',
          version: [1, 0, 0],
        },
      ],
    };
    writeFileSync(manifest, JSON.stringify(data, null, 2), 'utf-8');
  }

  const functions = path.join(root, 'functions');
  if (!existsSync(functions)) mkdirSync(functions);

  return { root, manifest, functions };
}

const pack = getDevPackFolder();

const day = getCurrentDay();
const lines = getDataLines(day);
const grid = getGrid(lines);

const flowers = [
  'allium',
  'azure_bluet',
  'blue_orchid',
  'cornflower',
  'red_tulip',
  'dandelion',
  'lilac',
  'lily_of_the_valley',
  'oxeye_daisy',
  'peony',
  'poppy',
  'rose_bush',
  'sunflower',
  'orange_tulip',
  'fern',
];

let commands = [];
const add = (l) => {
  commands.push(l);
};

const map = new Map();

const maxx = grid[0].length;
const maxy = grid.length;

// add(`fill ~2 ~-1 ~2 ~${maxx + 2} ~-1 ~${maxy + 2} minecraft:grass_block`);
for (const { x, y, cell } of enumGrid(grid)) {
  if (cell === '~') {
    add(`setblock ~${x + 2} ~-1 ~${y + 2} minecraft:water`);
  } else if (cell === '#') {
    add(
      `fill ~${x + 2} ~ ~${y + 2} ~${x + 2} ~1 ~${y + 2} minecraft:cobblestone`
    );
  } else if (cell === '.') {
    add(`setblock ~${x + 2} ~-1 ~${y + 2} minecraft:grass_block`);
  } else if (cell >= 'A' && cell <= 'Z') {
    if (!map.has(cell)) {
      map.set(cell, flowers[map.size]);
    }
    add(`setblock ~${x + 2} ~-1 ~${y + 2} minecraft:grass_block`);
    add(`setblock ~${x + 2} ~ ~${y + 2} minecraft:${map.get(cell)}`);
  }
}

const funcname = 'l15';
if (commands.length < 10_000) {
  const content = commands.join('\n');
  writeFileSync(
    path.join(pack.functions, `${funcname}.mcfunction`),
    content,
    'utf8'
  );
  consola.info(`Created function ${funcname}`);
} else {
  let i = 1;
  for (const c of chunk(commands, 10_000)) {
    const content = c.join('\n');
    writeFileSync(
      path.join(pack.functions, `${funcname}-${i++}.mcfunction`),
      content,
      'utf8'
    );
  }
  consola.info(`Created functions ${funcname}-1 to ${funcname}-${i - 1}`);
}

consola.success('Done.');
