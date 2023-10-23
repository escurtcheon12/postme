FROM node:14.16.1

WORKDIR /app

COPY package* .
RUN npm i

COPY . .

EXPOSE 5001

ENV NODE_OPTIONS="--max-old-space-size=2048"

CMD ["npx", "nodemon", "server.js"]