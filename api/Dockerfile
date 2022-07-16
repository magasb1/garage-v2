FROM node:18.6-alpine

RUN apk add --virtual \
    build-essential \
    python3 \
    py3-pip \
    make \
    g++
    
WORKDIR /app
COPY package*.json ./
RUN npm install

COPY /app/dist /app/dist

EXPOSE 3001
CMD ["node", "/app/dist/src/app.js"]
