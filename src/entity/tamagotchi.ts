import events = require('events');
import { TAMAGOTCHI_RULES } from './tamagotchi.types';

interface IPet {
  run: () => void;
  feed: () => void;
  sleep: () => void;
  age: number;
  fatigue: number;
  hunger: number;
  health: number;
  mealsEaten: number;
}

export default class Tamagotchi extends events.EventEmitter implements IPet {
  fatigue: number;
  hunger: number;
  age: number;
  health: number;
  mealsEaten: number;

  constructor() {
    super();
    this.mealsEaten = 0;

    this.fatigue = TAMAGOTCHI_RULES.FATIGUE_MIN;
    this.hunger = TAMAGOTCHI_RULES.HUNGER_MIN;
    this.health = TAMAGOTCHI_RULES.HEALTH_MAX;
    this.age = TAMAGOTCHI_RULES.AGE_MIN;
  }

  run(): void {
    this.changeValueBy('age', 0.5);
    this.changeValueBy('hunger', 1);
    this.changeValueBy('fatigue', 1);

    if (this.isHungry()) {
      this.changeValueBy('health', -1);
    }

    if (this.isDied()) {
      this.die();
    }

    if (this.isTired()) {
      this.sleep();
    }

    if (this.needPoop()) {
      this.poop();
    }
  }

  private isHungry(): boolean {
    return this.hunger >= TAMAGOTCHI_RULES.FEED_THRESHOLD;
  }

  private isTired(): boolean {
    return this.fatigue >= TAMAGOTCHI_RULES.SLEEP_THRESHOLD;
  }

  private isDied(): boolean {
    return (
      this.age === TAMAGOTCHI_RULES.AGE_MAX ||
      this.health === TAMAGOTCHI_RULES.HEALTH_MIN
    );
  }

  private needPoop(): boolean {
    return this.mealsEaten >= TAMAGOTCHI_RULES.POOP_THRESHOLD;
  }

  private die(): void {
    let reason = 'unknown';

    if (this.age === TAMAGOTCHI_RULES.AGE_MAX) {
      reason = 'old age';
    } else if (this.hunger === TAMAGOTCHI_RULES.HUNGER_MAX) {
      reason = 'starvation';
    }

    this.emit('died', reason);
  }

  sleep(): string | void {
    this.fatigue = TAMAGOTCHI_RULES.FATIGUE_MIN;
    this.emit('sleep');
  }

  poop(): void {
    if (!this.needPoop()) {
      return;
    }

    this.mealsEaten = 0;
    this.emit('poop');
  }

  feed(): string | void {
    if (!this.isHungry()) {
      return 'nope thanks!';
    }

    this.hunger = TAMAGOTCHI_RULES.HUNGER_MIN;
    this.health = TAMAGOTCHI_RULES.HEALTH_MAX;
    this.mealsEaten++;
    this.emit('feed');
  }

  changeValueBy(prop: string, val: number = 0): void {
    let needChange: boolean;

    if (val > 0) {
      needChange = this[prop] < TAMAGOTCHI_RULES[`${prop.toUpperCase()}_MAX`];
    } else if (val < 0) {
      needChange = this[prop] > TAMAGOTCHI_RULES[`${prop.toUpperCase()}_MIN`];
    }

    if (needChange) {
      this[prop] += val;
    }
  }
}
