# Tamagotchi

## What is this?

This is a cli-based Tamagotchi written in NodeJS. In the game, you can put it to sleep and feed it when it feels hungry. Besides, it knows when to poop and goes to sleep if it feels tired. Enjoy it!

## How to play it?

There are basically 2 ways to run the program. You can either run it in your terminal through `yarn play` or run it inside a Docker container.

### Run it without Docker

1. Run `yarn` from project root
2. Once dependencies are installed, simply run `yarn play`

### Run it inside Docker (Recommended)

1. Build the image. In your project root, run `docker build -t tamagotchi:v1.0 .`.
2. Following a successful build, grab your image id. Run `docker images` and note down `IMAGE ID` for `tamagotchi`.
3. Then run `docker run --rm -it <IMAGE_ID>`

Note, press `ctrl+c` to exit when you finish play.

## Rules and Assumptions

Following rules have been defined to determine tamagotchi's lifecycle and activities.

- Unit of time for each run is `5` seconds. It means tamagotchi runs itself on every 5 seconds
- Tamagotchi has a ranged fatigue from `0 - 100`. The threshold of fatigue for tamagotchi to go to sleep is `80`. i.e it automatically goes to sleep when fatigue is or over `80`. Fatigue will be reset to `0` after sleep.
- Tamagotchi has a ranged hunger from `20 - 100`. The threshold of hunger for tamagotchi to lose health from hunger is `80`. i.e Health drops by `1` when hunger is or goes beyond `80`.
- Tamagotchi has a ranged health from `0 - 100`. Tamagotchi start losing health by `1` when it feels hunger. If not feed after it's hungry for a while, it will lose more health until it gg i.e health drops to zero. This will result in a game over.
- Tamagotchi has a ranged age from `1 - 99`. It starts with age of `1` and goes all the way to `99`. When max age is reached, it will die of old age.
- Tamagotchi will go to poop on its own as soon as it consumes every `3` meals.
- When put tamagotchi to sleep, it helps bring fatigue down to `0`.
- Tamagotchi will reject your treats if it's not feeling hungry - i.e hunger is lower than `80`.

## Tech Stack

My intent is to keep dependency as least as possible. See them below:

- NodeJS
- TypeScript
- Cron
- Jest
- Docker

## Test

From terminal, run `yarn test`.

## Caveats

Run tests in Docker container is not enabled. If you need to run tests, please run `yarn test` outside Docker container.

## What is next?

This game is extensible and you can definitely clone it and add more features on top to make your tamagotchi more feature-rich.
