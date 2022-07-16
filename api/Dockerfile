FROM node:lts-alpine as base

RUN apk add --virtual \
    build-essential \
    python3 \
    py3-pip \
    make \
    g++
    
WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . ./
COPY tsconfig.json ./tsconfig.json
RUN npm run build

FROM node:lts-alpine

COPY --from=base /app/node_modules /app/node_modules
COPY --from=base /app/dist /app/dist

EXPOSE 3001
CMD ["node", "/app/dist/src/app.js"]
