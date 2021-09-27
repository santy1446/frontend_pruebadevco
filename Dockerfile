FROM node:latest as build-step

RUN mkdir -p /app

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

RUN npm run build --prod

FROM nginx:alphine

COPY --from=build-step /app/dist/candidatesdevco /usr/share/nginx/html