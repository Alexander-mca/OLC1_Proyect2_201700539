FROM node:15.0
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm i nodemon morgan cors express
RUN npm i @types/morgan @types/cors @types/nodemon @types/express
COPY . .
CMD [ "npm","run", "dev" ]