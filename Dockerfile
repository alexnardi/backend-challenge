FROM node:alpine 
# v16.17.0 (LTS)

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["nodemon -L", "./src/server.js"]