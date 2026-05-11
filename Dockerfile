FROM node:20-alpine

RUN apk add --no-cache make gcc g++ python3 jq rsync zip

WORKDIR /app

COPY . .

RUN npm install