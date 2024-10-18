FROM node:18.0.0-alpine

WORKDIR /app

ADD package*.json yarn.lock /app/

COPY app/package.json ./app/package.json
COPY app-legacy/package.json ./app-legacy/package.json
COPY landing/package.json ./landing/package.json
COPY ui/package.json ./ui/package.json

RUN yarn install
ARG NEXT_PUBLIC_API_BASE_URL

COPY . .
RUN yarn build:legacy

EXPOSE 3001
CMD ["yarn", "start:legacy"]
