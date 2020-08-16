import Tamagotchi from './tamagotchi';
import { TAMAGOTCHI_RULES } from './tamagotchi.types';
const EventEmitter = require('events').EventEmitter;

jest.mock('events');

describe('test tamagotchi class', () => {
  let tamagotchi;

  beforeEach(() => {
    EventEmitter.mockClear();
    tamagotchi = new Tamagotchi();
  });

  test('test props initial values', () => {
    expect(TAMAGOTCHI_RULES.HEALTH_MIN).toBe(0);
    expect(TAMAGOTCHI_RULES.HEALTH_MAX).toBe(100);

    expect(TAMAGOTCHI_RULES.HUNGER_MIN).toBe(20);
    expect(TAMAGOTCHI_RULES.HUNGER_MAX).toBe(100);
    expect(TAMAGOTCHI_RULES.FEED_THRESHOLD).toBe(80);

    expect(TAMAGOTCHI_RULES.FATIGUE_MIN).toBe(0);
    expect(TAMAGOTCHI_RULES.FATIGUE_MAX).toBe(100);
    expect(TAMAGOTCHI_RULES.SLEEP_THRESHOLD).toBe(80);

    expect(TAMAGOTCHI_RULES.AGE_MIN).toBe(1);
    expect(TAMAGOTCHI_RULES.AGE_MAX).toBe(99);

    expect(TAMAGOTCHI_RULES.POOP_THRESHOLD).toBe(3);
  });

  // isHungry
  test('hungry if hunger >= TAMAGOTCHI_RULES.FEED_THRESHOLD or not hungry if hunger < TAMAGOTCHI_RULES.FEED_THRESHOLD', () => {
    tamagotchi.hunger = TAMAGOTCHI_RULES.FEED_THRESHOLD + 1;
    expect(tamagotchi.isHungry()).toEqual(true);
    tamagotchi.hunger = TAMAGOTCHI_RULES.FEED_THRESHOLD;
    expect(tamagotchi.isHungry()).toEqual(true);
    tamagotchi.hunger = TAMAGOTCHI_RULES.FEED_THRESHOLD - 1;
    expect(tamagotchi.isHungry()).toEqual(false);
  });

  // isTired
  test('tired if fatigue >= SLEEP_THRESHOLD or not tired if fatigue < SLEEP_THRESHOLD', () => {
    tamagotchi.fatigue = TAMAGOTCHI_RULES.SLEEP_THRESHOLD + 1;
    expect(tamagotchi.isTired()).toEqual(true);
    tamagotchi.fatigue = TAMAGOTCHI_RULES.SLEEP_THRESHOLD;
    expect(tamagotchi.isTired()).toEqual(true);
    tamagotchi.fatigue = TAMAGOTCHI_RULES.SLEEP_THRESHOLD - 1;
    expect(tamagotchi.isTired()).toEqual(false);
  });

  // isDied
  test('died if age = AGE_MAX or health = HEALTH_MIN', () => {
    tamagotchi.age = TAMAGOTCHI_RULES.AGE_MAX;
    expect(tamagotchi.isDied()).toEqual(true);
    tamagotchi.age = TAMAGOTCHI_RULES.AGE_MIN;
    tamagotchi.health = TAMAGOTCHI_RULES.HEALTH_MIN;
    expect(tamagotchi.isDied()).toEqual(true);
  });

  // needPoop
  test('eaten 3 and more meals', () => {
    expect(tamagotchi.needPoop()).toEqual(false);
    tamagotchi.mealsEaten = TAMAGOTCHI_RULES.POOP_THRESHOLD;
    expect(tamagotchi.needPoop()).toEqual(true);

    tamagotchi.mealsEaten = TAMAGOTCHI_RULES.POOP_THRESHOLD + 2;
    expect(tamagotchi.needPoop()).toEqual(true);
  });

  // die
  test('emit reason on death of old age', () => {
    tamagotchi.age = TAMAGOTCHI_RULES.AGE_MAX;

    tamagotchi.die();
    expect(EventEmitter.mock.instances[0].emit.mock.calls.length).toBe(1);
    expect(EventEmitter.mock.instances[0].emit.mock.calls[0][0]).toEqual(
      'died'
    );
    expect(EventEmitter.mock.instances[0].emit.mock.calls[0][1]).toEqual(
      'old age'
    );
  });

  // die
  test('emit reason on death of starvation', () => {
    tamagotchi.hunger = TAMAGOTCHI_RULES.HUNGER_MAX;
    tamagotchi.die();
    expect(EventEmitter.mock.instances[0].emit.mock.calls[0][0]).toEqual(
      'died'
    );
    expect(EventEmitter.mock.instances[0].emit.mock.calls[0][1]).toEqual(
      'starvation'
    );
  });

  // die
  test('emit reason on death of unknown', () => {
    tamagotchi.die();
    expect(EventEmitter.mock.instances[0].emit.mock.calls[0][0]).toEqual(
      'died'
    );
    expect(EventEmitter.mock.instances[0].emit.mock.calls[0][1]).toEqual(
      'unknown'
    );
  });

  // sleep
  test('reset fatigue after sleep', () => {
    tamagotchi.fatigue = TAMAGOTCHI_RULES.FATIGUE_MAX;
    tamagotchi.sleep();
    expect(EventEmitter.mock.instances[0].emit.mock.calls[0][0]).toEqual(
      'sleep'
    );
    expect(tamagotchi.fatigue).toEqual(TAMAGOTCHI_RULES.FATIGUE_MIN);
  });

  // poop
  test('reset mealsEaten after poop', () => {
    const res = tamagotchi.poop();
    expect(res).toBeUndefined();

    tamagotchi.mealsEaten = TAMAGOTCHI_RULES.POOP_THRESHOLD;
    tamagotchi.poop();
    expect(EventEmitter.mock.instances[0].emit.mock.calls[0][0]).toEqual(
      'poop'
    );
    expect(tamagotchi.mealsEaten).toEqual(0);
  });

  // feed
  test('reset hunger/health and increment mealsEaten by 1', () => {
    const res = tamagotchi.feed();
    expect(res).toEqual('nope thanks!');

    tamagotchi.hunger = TAMAGOTCHI_RULES.FEED_THRESHOLD;
    tamagotchi.feed();
    expect(EventEmitter.mock.instances[0].emit.mock.calls[0][0]).toEqual(
      'feed'
    );
    expect(tamagotchi.mealsEaten).toEqual(1);
    expect(tamagotchi.hunger).toEqual(TAMAGOTCHI_RULES.HUNGER_MIN);
    expect(tamagotchi.health).toEqual(TAMAGOTCHI_RULES.HEALTH_MAX);

    tamagotchi.hunger = TAMAGOTCHI_RULES.FEED_THRESHOLD;
    tamagotchi.feed();
    tamagotchi.hunger = TAMAGOTCHI_RULES.FEED_THRESHOLD;
    tamagotchi.feed();
    expect(tamagotchi.mealsEaten).toEqual(3);
  });

  // changeValueBy
  test('change prop value by a given value', () => {
    tamagotchi.changeValueBy('hunger', 2);
    expect(tamagotchi.hunger).toEqual(TAMAGOTCHI_RULES.HUNGER_MIN + 2);

    tamagotchi.changeValueBy('health', -2);
    expect(tamagotchi.health).toEqual(TAMAGOTCHI_RULES.HEALTH_MAX - 2);

    tamagotchi.health = TAMAGOTCHI_RULES.HEALTH_MAX;
    tamagotchi.changeValueBy('health', 0);
    expect(tamagotchi.health).toEqual(TAMAGOTCHI_RULES.HEALTH_MAX);
  });

  // run
  test('run', () => {
    let _changeValueBy = jest.spyOn(tamagotchi, 'changeValueBy');

    jest.spyOn(tamagotchi, 'isHungry').mockImplementation(() => true);
    jest.spyOn(tamagotchi, 'isDied').mockImplementation(() => true);
    jest.spyOn(tamagotchi, 'isTired').mockImplementation(() => true);
    jest.spyOn(tamagotchi, 'needPoop').mockImplementation(() => true);
    jest.spyOn(tamagotchi, 'die');
    jest.spyOn(tamagotchi, 'sleep');
    jest.spyOn(tamagotchi, 'poop');

    tamagotchi.run();
    expect(tamagotchi.changeValueBy).toHaveBeenCalledWith('age', 0.5);
    expect(tamagotchi.changeValueBy).toHaveBeenCalledWith('hunger', 1);
    expect(tamagotchi.changeValueBy).toHaveBeenCalledWith('fatigue', 1);

    expect(tamagotchi.changeValueBy).toHaveBeenCalledWith('health', -1);
    expect(tamagotchi.die).toHaveBeenCalledWith();
    expect(tamagotchi.sleep).toHaveBeenCalledWith();
    expect(tamagotchi.poop).toHaveBeenCalledWith();
  });
});
