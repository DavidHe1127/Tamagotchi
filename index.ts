import { CronJob } from 'cron';
import * as readline from 'readline';
import * as events from 'events';

import Tamagotchi from './src/entity/tamagotchi';
import utils from './src/utils';
import * as promptData from './src/data/prompt.json';

const tamagotchi = new Tamagotchi();

tamagotchi.on('sleep', () => {
  utils.msg('[Slept]: Feel like a million bucks!');
});

tamagotchi.on('poop', () => {
  utils.msg('[Pooped]: Smells but I feel good!');
});

tamagotchi.on('feed', () => {
  utils.msg('[Fed]: Far out! what a meal!!');
});

tamagotchi.on('died', (reason) => {
  utils.msg(`[Sad]: Died of ${reason}`);
  job.stop();
  process.exit(0);
});

const job = new CronJob(
  '*/5 * * * * *',
  function() {
    tamagotchi.run();
  },
  null,
  false,
  'Australia/Sydney'
);

job.start();

const rl = readline.createInterface(process.stdin, process.stdout);
const prompt = utils.buildPrompt(promptData.title, promptData.options);

rl.setPrompt(prompt);
rl.prompt();

/*
 start
*/
rl.on('line', (line) => {
  const actions = {
    1: tamagotchi.feed,
    2: tamagotchi.sleep,
    3: () => {
      return `age:${tamagotchi.age} hunger:${tamagotchi.hunger} fatigue:${
        tamagotchi.fatigue
      } health:${tamagotchi.health}`;
    },
  };

  const action = actions[line.trim()];

  if (!action) {
    utils.msg("Hah? what's that?");
  } else {
    const res = action.apply(tamagotchi);
    res && utils.msg(res);
  }

  setTimeout(() => {
    rl.prompt();
  }, 1000);
}).on('close', () => {
  utils.msg('Bye!');
  process.exit(0);
});
