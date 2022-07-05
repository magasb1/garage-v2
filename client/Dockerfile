# Setup and build the client
FROM node:lts-alpine as client-build
WORKDIR /app/
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
RUN npm run build

# Setup the server
FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
WORKDIR /app/
COPY ./build /app/build/

EXPOSE 80