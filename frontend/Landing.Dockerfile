FROM node:18.0.0-alpine

WORKDIR /app

ADD package*.json yarn.lock /app/

COPY app/package.json ./app/package.json
COPY app-legacy/package.json ./app-legacy/package.json
COPY landing/package.json ./landing/package.json
COPY ui/package.json ./ui/package.json
COPY next-transpile-modules/package.json ./next-transpile-modules/package.json

RUN yarn install

COPY . .
RUN yarn build:landing

EXPOSE 3002
CMD ["yarn", "start:landing"]
