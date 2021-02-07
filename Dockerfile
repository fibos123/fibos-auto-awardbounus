FROM node:15

COPY package.json ./

RUN yarn

CMD [ "yarn", "server" ]
