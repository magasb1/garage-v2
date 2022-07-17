FROM node:18.6-alpine as base

RUN apk add --virtual \
    build-essential \
    python3 \
    py3-pip \
    make \
    g++
    
WORKDIR /app
COPY package*.json ./

COPY . ./
RUN npm install
RUN npm run build


FROM node:18.6-alpine
COPY --from=base /app/node_modules /app/node_modules
COPY --from=base /app/dist /app
EXPOSE 3001
CMD ["node", "/app/src/app.js"]