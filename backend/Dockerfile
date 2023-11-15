FROM node:14.16.1-alpine

# WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
COPY . .

EXPOSE 5001

ENV GENERATE_SOURCEMAP="false"
ENV NODE_OPTIONS="--max_old_space_size=4096"

CMD ["npx", "nodemon", "server.js"]
