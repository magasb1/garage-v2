FROM nginx:alpine

ARG CERTBOT_EMAIL=info@domain.com
ARG DOMAIN_LIST

COPY ./build /app
COPY nginx.conf /etc/nginx/nginx.conf

RUN apk add certbot certbot-nginx \
    && mkdir /etc/letsencrypt

RUN certbot certonly --standalone --agree-tos -m "${CERTBOT_EMAIL}" -n -d ${DOMAIN_LIST} \
    && echo "PATH=$PATH" > /etc/cron.d/certbot-renew  \
    && echo "0 12 * * * /usr/bin/certbot renew --nginx >> /var/log/cron.log 2>&1" >>/etc/cron.d/certbot-renew \
    && crontab /etc/cron.d/certbot-renew

VOLUME /etc/letsencrypt
EXPOSE 80 443

CMD [ "sh", "-c", "crontab && nginx -g 'daemon off;'" ]
