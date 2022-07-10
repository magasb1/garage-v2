FROM nginx:alpine

ARG CERTBOT_EMAIL=info@domain.com
ARG DOMAIN_LIST

RUN apk add python3 python3-dev py3-pip build-base libressl-dev musl-dev libffi-dev rust cargo \
    && pip3 install pip --upgrade \
    && pip3 install certbot-nginx \
    && mkdir /etc/letsencrypt \
    && certbot certonly --standalone --agree-tos -m "${CERTBOT_EMAIL}" -n -d ${DOMAIN_LIST} \
    && echo "0 12 * * * /usr/bin/certbot renew --nginx >> /var/log/cron.log 2>&1" >>/etc/cron.d/certbot-renew \
    && crontab /etc/cron.d/certbot-renew

VOLUME /etc/letsencrypt
EXPOSE 80 443

CMD [ "sh", "-c", "crontab && nginx -g 'daemon off;'" ]
