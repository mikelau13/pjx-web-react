# base image
FROM node:14.5.0-slim

WORKDIR /home/node

COPY package.json .
COPY package-lock.json .
RUN npm install --quiet

COPY . .

RUN npm run build
