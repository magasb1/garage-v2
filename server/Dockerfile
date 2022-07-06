FROM node:lts-alpine

RUN apk add --virtual build-essential \
          python3 \
          py3-pip \
          make \
          g++

WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm i && npm run build
CMD ["npm", "run", "start"]