FROM node:16-alpine

WORKDIR /app

RUN npm install -g pm2

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN cp .env.example .env.production

CMD ["pm2-runtime", "ecosystem.config.js", "--env", "production"]