FROM node:15.0
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm i nodemon morgan cors express
RUN npm i @types/morgan @types/cors @types/nodemon @types/express
RUN apt-get install -y graphviz
COPY . .
CMD [ "npm","run", "dev" ]
