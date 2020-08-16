FROM node:12

WORKDIR /usr/src/tamagotchi

COPY . .
RUN yarn

CMD [ "yarn", "play" ]
