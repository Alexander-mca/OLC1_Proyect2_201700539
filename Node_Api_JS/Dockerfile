FROM node:15.0
WORKDIR /app
COPY package*.json ./
RUN apt-get update
RUN apt-get install -y graphviz
RUN npm install
RUN npm install nodemon morgan cors express
RUN npm install @types/morgan @types/cors @types/nodemon @types/express
COPY . .
CMD [ "npm","run", "dev" ]
