FROM node:18-alpine3.15

WORKDIR /app/snapshot/

ENV PORT 3030

COPY package*.json tsconfig.json ./

RUN npm install
RUN npm -g install ts-node
RUN npm -g install typescript

COPY . .

# Expose the PORT
EXPOSE $PORT

CMD [ "npm", "run", "start" ]