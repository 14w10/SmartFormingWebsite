FROM node:21.1.0-alpine

ENV NODE_OPTIONS="--max-old-space-size=1536"

RUN apk add curl

WORKDIR /app

ADD package*.json yarn.lock /app/

COPY app/package.json ./app/package.json
COPY landing/package.json ./landing/package.json
COPY ui/package.json ./ui/package.json

RUN yarn install

RUN printenv

COPY . .
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_LANDING_URL
RUN yarn build

EXPOSE 3003
CMD ["yarn", "start"]

