import { existsSync, readFileSync, writeFileSync } from 'fs';
import { consola } from 'consola';
import { ofetch } from 'ofetch';

export async function submitAnswer({ year, day, level, answer }) {
  if (!year) year = new Date().getFullYear();

  let incorrect = {};
  if (existsSync('incorrect.json')) {
    incorrect = JSON.parse(readFileSync('incorrect.json', 'utf-8'));
  }
  const wrong = incorrect[`${day}-${level}`] || {};
  if (wrong[answer]) {
    consola.error('Réponse incorrect et déjà envoyée : ' + wrong[answer]);
    return false;
  }

  const res = await ofetch(
    `https://everybody.codes/api/event/${year}/quest/${+day}/part/${level}/answer`,
    { body: { answer }, method: 'POST' }
  );
  if (res.correct) {
    consola.success('Bonne réponse !');
    return true;
  } else {
    wrong[answer] = { length: res.lengthCorrect, first: res.firstCorrect };

    incorrect[`${day}-${level}`] = wrong;
    writeFileSync(
      'incorrect.json',
      JSON.stringify(incorrect, null, 2),
      'utf-8'
    );
    return false;
  }
}
