import { existsSync, readFileSync, writeFileSync } from 'fs';
import { consola } from 'consola';
import { ofetch } from 'ofetch';

export async function submitAnswer({ year, day, level, answer }) {
  if (!process.env.COOKIE) throw new Error('No cookie in config!');
  if (!year) year = new Date().getFullYear();

  let incorrect = {};
  if (existsSync('incorrect.json')) {
    incorrect = JSON.parse(readFileSync('incorrect.json', 'utf-8'));
  }
  const wrong = incorrect[`${day}-${level}`] || {};
  if (wrong[answer]) {
    consola.error('Réponse incorrect et déjà envoyée', wrong[answer]);
    return false;
  }

  try {
    const res = await ofetch(
      `https://everybody.codes/api/event/${year}/quest/${+day}/part/${level}/answer`,
      {
        body: { answer },
        method: 'POST',
        headers: { cookie: 'everybody-codes=' + process.env.COOKIE },
      }
    );
    if (res.correct) {
      consola.success('Bonne réponse !');
      return true;
    } else {
      wrong[answer] = { length: res.lengthCorrect, first: res.firstCorrect };

      consola.error(res);

      consola.error('Mauvaise réponse !', wrong[answer]);

      incorrect[`${day}-${level}`] = wrong;
      writeFileSync(
        'incorrect.json',
        JSON.stringify(incorrect, null, 2),
        'utf-8'
      );
      return false;
    }
  } catch (e) {
    if (e.statusCode === 423) {
      consola.error('Mauvaise réponse envoyée trop récemment.');
    } else if (e.statusCode === 409) {
      consola.error(`Quest déjà rélisée ${day}-${level}`);
    } else {
      consola.error(e);
    }
  }
}
