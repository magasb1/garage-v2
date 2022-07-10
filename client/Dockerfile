# Setup and build the client
#FROM node:lts-alpine as client-build
#WORKDIR /app/
#COPY package*.json ./
#RUN npm install --omit=dev
#COPY . .
#RUN npm run build

# Setup the server
#FROM nginx:alpine
#COPY nginx.conf /etc/nginx/nginx.conf
#WORKDIR /app/
#COPY ./build /app
#EXPOSE 80


FROM nginx:alpine

EXPOSE 80 443

ARG CERTBOT_EMAIL=info@domain.com
ARG DOMAIN_LIST

RUN apk add certbot cron python-certboy-nginx bash wget \
      && certbot certonly --standalone --agree-tos -m "${CERTBOT_EMAIL}" -n -d ${DOMAIN_LIST} \
      && rm -rf /var/lib/apt/lists/* \
      && echo "PATH=$PATH" > /etc/cron.d/certbot-renew  \
      && echo "@monthly certbot renew --nginx >> /var/log/cron.log 2>&1" >>/etc/cron.d/certbot-renew \
      && crontab /etc/cron.d/certbot-renew

COPY nginx.conf /etc/nginx/nginx.conf
WORKDIR /app/
COPY ./build /app

VOLUME /etc/letsencrypt

CMD [ "sh", "-c", "cron && nginx -g 'daemon off;'" ]