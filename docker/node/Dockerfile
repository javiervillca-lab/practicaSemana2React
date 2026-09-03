FROM node:22.15.0-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 5173
