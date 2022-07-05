FROM node:lts-alpine
WORKDIR /app
COPY package*.json ./
COPY . .
RUN apk add --virtual build-essential \
          python3 \
          py3-pip \
          make \
          g++
RUN npm i
CMD ["npm", "run", "start"]