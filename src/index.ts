// Node modules.
import _ from 'lodash';
import { mkdirp, writeFile } from 'fs-extra';
import moment from 'moment';
// Local modules.
import { getActionRuns } from './github-crawler';

const statusToEmoji = (status: string) => {
  switch (status) {
    case 'succeed':
      return '🟢';
    case 'failed':
      return '🔴';
    case 'running':
      return '🏃';
    default:
      return '❔';
  }
}

const main = async () => {
  const outputPath = './';

  try {
    const serviceList = {
      'data - LeekDuck': await getActionRuns('pmgo-professor-willow/data-leekduck', 3),
      'data - TheSilphRoad': await getActionRuns('pmgo-professor-willow/data-thesilphroad', 3),
      'data - PokemonGoLive': await getActionRuns('pmgo-professor-willow/data-pokemongolive', 3),
      'data - Tweets': await getActionRuns('pmgo-professor-willow/data-tweets', 3),
      'data - YouTuber': await getActionRuns('pmgo-professor-willow/data-youtuber', 3),
      'LINE - Pokedex (LIFF)': await getActionRuns('pmgo-professor-willow/willow-pokedex', 3),
    };

    let markdownText = '';

    _.forEach(serviceList, (runs, key) => {
      markdownText += `### ${key}\n`;

      markdownText += [
        '| Status | Timestamp |',
        '|:------:|:---------:|',
        ...runs.map((run) => `| ${statusToEmoji(run.status)} | ${moment(run.time).fromNow()} |`),
      ].join('\n');

      markdownText += '\n\n';
    });

    await writeFile(`${outputPath}/README.md`, markdownText);
  } catch (e) {
    console.error(e);
  }
};

main();
